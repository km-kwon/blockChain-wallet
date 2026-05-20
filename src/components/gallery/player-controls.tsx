import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

type PlayerControlsProps = {
  enabled: boolean;
};

const forward = new Vector3();
const right = new Vector3();
const movement = new Vector3();

export default function PlayerControls({ enabled }: PlayerControlsProps) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      keys.current[event.code] = true;
    }

    function handleKeyUp(event: KeyboardEvent) {
      keys.current[event.code] = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!enabled) {
      return;
    }

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();
    movement.set(0, 0, 0);

    if (keys.current.KeyW) movement.add(forward);
    if (keys.current.KeyS) movement.sub(forward);
    if (keys.current.KeyD) movement.add(right);
    if (keys.current.KeyA) movement.sub(right);

    if (movement.lengthSq() > 0) {
      movement.normalize();
      camera.position.addScaledVector(movement, delta * (keys.current.ShiftLeft ? 4.8 : 3.1));
      camera.position.x = Math.max(-5.15, Math.min(5.15, camera.position.x));
      camera.position.z = Math.max(-5.15, Math.min(5.15, camera.position.z));
      camera.position.y = 1.7;
    }
  });

  return <PointerLockControls enabled={enabled} />;
}
