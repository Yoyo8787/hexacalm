import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3, type Camera } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { MOVE_KEYS, MOVE_RESPONSE, MOVE_SPEED_PER_DISTANCE } from "./constants";

export function useKeyboardMove() {
  const invalidate = useThree((state) => state.invalidate);
  const pressed = useRef(new Set<string>());
  const motion = useMemo(
    () => ({
      velocity: new Vector3(),
      desired: new Vector3(),
      forward: new Vector3(),
      right: new Vector3(),
    }),
    [],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Leave browser shortcuts such as Ctrl+S untouched.
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (!(event.code in MOVE_KEYS)) return;
      pressed.current.add(event.code);
      invalidate();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      pressed.current.delete(event.code);
    };
    const release = () => pressed.current.clear();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", release);
    };
  }, [invalidate]);

  return useMemo(
    () => ({
      // Moves camera and orbit target together; returns true while moving.
      step(delta: number, camera: Camera, orbit: OrbitControlsImpl) {
        const { velocity, desired, forward, right } = motion;
        let inputX = 0;
        let inputZ = 0;
        for (const code of pressed.current) {
          const [x, z] = MOVE_KEYS[code];
          inputX += x;
          inputZ += z;
        }
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        right.crossVectors(forward, camera.up).normalize();
        desired
          .set(0, 0, 0)
          .addScaledVector(forward, inputZ)
          .addScaledVector(right, inputX);
        if (desired.lengthSq() > 0) {
          desired
            .normalize()
            .multiplyScalar(
              MOVE_SPEED_PER_DISTANCE *
                camera.position.distanceTo(orbit.target),
            );
        }
        velocity.lerp(desired, 1 - Math.exp(-MOVE_RESPONSE * delta));
        if (desired.lengthSq() === 0 && velocity.lengthSq() < 1e-4) {
          velocity.set(0, 0, 0);
          return false;
        }
        camera.position.addScaledVector(velocity, delta);
        orbit.target.addScaledVector(velocity, delta);
        return true;
      },
      stop() {
        motion.velocity.set(0, 0, 0);
      },
    }),
    [motion],
  );
}
