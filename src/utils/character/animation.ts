import {
  AnimationMixer,
  MathUtils,
  type AnimationAction,
  type AnimationClip,
  type Object3D,
} from "three";
import { CHARACTER_BASE_ANIMATION_SPEED } from "../../constants/character";

const TRANSITION_SECONDS = 0.18;
const HOP_HEIGHT = 0.1;

export class CharacterAnimation {
  private readonly mixer: AnimationMixer;
  private readonly scene: Object3D;
  private readonly idle: AnimationAction;
  private readonly walk: AnimationAction;
  private readonly root: Object3D | undefined;
  private weight = 0;
  private walking = false;
  private landingPending = false;

  constructor(scene: Object3D, clips: AnimationClip[]) {
    this.scene = scene;
    this.mixer = new AnimationMixer(scene);
    this.idle = this.mixer.clipAction(getAnimationClip(clips, "idle"));
    this.walk = this.mixer.clipAction(getAnimationClip(clips, "walk"));
    this.root = scene.getObjectByName("root");
    if (!this.root) {
      console.warn(
        "Character model has no root node: hop and landing disabled.",
      );
    }
    this.idle.play();
    this.walk.play().setEffectiveWeight(0);
  }

  update(
    delta: number,
    walking: boolean,
    speed: number,
    onLand?: () => void,
  ): void {
    const animationSpeed = speed * CHARACTER_BASE_ANIMATION_SPEED;
    if (walking && !this.walking && this.weight === 0) this.walk.time = 0;
    if (!walking && this.walking) {
      this.landingPending = (this.root?.position.y ?? 0) > 0;
    }
    if (walking) this.landingPending = false;
    this.walking = walking;

    this.weight = MathUtils.clamp(
      this.weight + ((walking ? 1 : -1) * delta) / TRANSITION_SECONDS,
      0,
      1,
    );
    const blend = MathUtils.smoothstep(this.weight, 0, 1);
    const previousTime = this.walk.time;
    const duration = this.walk.getClip().duration;
    this.walk
      .setEffectiveWeight(blend)
      .setEffectiveTimeScale(walking ? animationSpeed : 0);
    this.idle.setEffectiveWeight(1 - blend);
    this.mixer.update(delta);

    // 原動畫保留肢體動作；統一小跳曲線，讓每半個循環精確落地。
    if (this.root) {
      this.root.position.y =
        HOP_HEIGHT *
        Math.sin((this.walk.time / duration) * Math.PI * 2) ** 2 *
        blend;
    }

    const landed =
      walking &&
      Math.floor((previousTime + delta * animationSpeed) / (duration / 2)) >
        Math.floor(previousTime / (duration / 2));
    if (landed || (this.landingPending && this.weight === 0)) {
      this.landingPending = false;
      onLand?.();
    }
  }

  dispose(): void {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.scene);
  }
}

function getAnimationClip(clips: AnimationClip[], name: string): AnimationClip {
  const clip = clips.find((candidate) => candidate.name === name);
  if (!clip) throw new Error(`角色模型缺少 ${name} 動畫。`);
  return clip;
}
