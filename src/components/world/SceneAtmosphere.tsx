import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  MathUtils,
  PointsMaterial,
} from "three";
import {
  REDUCED_TIME_TRANSITION,
  SCENE_ATMOSPHERE,
  SCENE_TIME_TRANSITION,
} from "../../constants/ambience";
import { prefersReducedMotion, useTimeOfDay } from "../../hooks/useTimeOfDay";

const DAY = SCENE_ATMOSPHERE.day;
const NIGHT = SCENE_ATMOSPHERE.night;
const STAR_COUNT = 840;
const STAR_RADIUS = 70;

// Points scattered over the whole sphere so the world floats in space,
// generated once per page load.
const STAR_POSITIONS = (() => {
  const positions = new Float32Array(STAR_COUNT * 3);
  for (let index = 0; index < STAR_COUNT; index += 1) {
    const azimuth = Math.random() * Math.PI * 2;
    const elevation = Math.asin(Math.random() * 2 - 1);
    positions[index * 3] =
      Math.cos(elevation) * Math.cos(azimuth) * STAR_RADIUS;
    positions[index * 3 + 1] = Math.sin(elevation) * STAR_RADIUS;
    positions[index * 3 + 2] =
      Math.cos(elevation) * Math.sin(azimuth) * STAR_RADIUS;
  }
  return positions;
})();

const dayFog = new Color(DAY.fog);
const nightFog = new Color(NIGHT.fog);
const dayKey = new Color(DAY.keyLight);
const nightKey = new Color(NIGHT.keyLight);
const dayAmbient = new Color(DAY.ambientLight);
const nightAmbient = new Color(NIGHT.ambientLight);

// Fog, sky, lights and stars blend between day (0) and night (1).
function SceneAtmosphere() {
  const timeOfDay = useTimeOfDay();
  const invalidate = useThree((state) => state.invalidate);
  const background = useRef<Color>(null);
  const fog = useRef<Fog>(null);
  const ambient = useRef<AmbientLight>(null);
  const keyLight = useRef<DirectionalLight>(null);
  const stars = useRef<PointsMaterial>(null);
  // Props only seed the first frame; afterwards useFrame owns these values.
  const [initial] = useState(timeOfDay === "night" ? 1 : 0);
  const progress = useRef(initial);
  const applied = useRef(Number.NaN);

  useEffect(() => invalidate(), [timeOfDay, invalidate]);

  useFrame((_, delta) => {
    const target = timeOfDay === "night" ? 1 : 0;
    if (progress.current === target && applied.current === target) return;

    const duration = prefersReducedMotion()
      ? REDUCED_TIME_TRANSITION
      : SCENE_TIME_TRANSITION;
    const step = delta / duration;
    progress.current =
      target > progress.current
        ? Math.min(progress.current + step, target)
        : Math.max(progress.current - step, target);
    const t = progress.current;
    applied.current = t;

    background.current?.lerpColors(dayFog, nightFog, t);
    if (fog.current) {
      fog.current.color.lerpColors(dayFog, nightFog, t);
      fog.current.near = MathUtils.lerp(DAY.fogNear, NIGHT.fogNear, t);
      fog.current.far = MathUtils.lerp(DAY.fogFar, NIGHT.fogFar, t);
    }
    if (ambient.current) {
      ambient.current.color.lerpColors(dayAmbient, nightAmbient, t);
      ambient.current.intensity = MathUtils.lerp(
        DAY.ambientIntensity,
        NIGHT.ambientIntensity,
        t,
      );
    }
    if (keyLight.current) {
      keyLight.current.color.lerpColors(dayKey, nightKey, t);
      keyLight.current.intensity = MathUtils.lerp(
        DAY.keyIntensity,
        NIGHT.keyIntensity,
        t,
      );
    }
    if (stars.current) {
      stars.current.opacity = t;
      stars.current.visible = t > 0;
    }
    if (t !== target) invalidate();
  });

  const start = initial ? NIGHT : DAY;
  return (
    <>
      <color ref={background} args={[start.fog]} attach="background" />
      <fog
        ref={fog}
        args={[start.fog, start.fogNear, start.fogFar]}
        attach="fog"
      />
      <ambientLight
        ref={ambient}
        color={start.ambientLight}
        intensity={start.ambientIntensity}
      />
      <directionalLight
        ref={keyLight}
        color={start.keyLight}
        intensity={start.keyIntensity}
        position={[8, 20, 7]}
      />
      <points>
        <bufferGeometry>
          <bufferAttribute
            args={[STAR_POSITIONS, 3]}
            attach="attributes-position"
          />
        </bufferGeometry>
        <pointsMaterial
          ref={stars}
          // Stars only appear at night, so they need no day counterpart.
          color="#e8eeff"
          depthWrite={false}
          fog={false}
          opacity={initial}
          size={1.6}
          sizeAttenuation={false}
          transparent
          visible={initial > 0}
        />
      </points>
    </>
  );
}

export default SceneAtmosphere;
