import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { TokenBalance } from "@/types/token";

const COLORS = ["#14b8a6", "#2563eb", "#e11d48", "#ca8a04", "#7c3aed", "#0891b2"];

type TokenHologramProps = {
  tokens: TokenBalance[];
};

export default function TokenHologram({ tokens }: TokenHologramProps) {
  const groupRef = useRef<Group>(null);
  const topTokens = tokens.slice(0, 6);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.24;
    }
  });

  return (
    <Float floatIntensity={0.18} rotationIntensity={0.08} speed={1.4}>
      <group position={[0, 1.25, 0]} ref={groupRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.16, 0.018, 12, 96]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.72} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.64, 0.012, 12, 96]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.58} />
        </mesh>
        {topTokens.map((token, index) => {
          const angle = (Math.PI * 2 * index) / Math.max(topTokens.length, 1);
          const height = 0.25 + Math.max(token.allocationPercent, 4) / 42;
          const x = Math.cos(angle) * 0.86;
          const z = Math.sin(angle) * 0.86;

          return (
            <group key={token.contractAddress} position={[x, height / 2, z]}>
              <mesh>
                <cylinderGeometry args={[0.075, 0.105, height, 18]} />
                <meshStandardMaterial
                  color={COLORS[index % COLORS.length]}
                  emissive={COLORS[index % COLORS.length]}
                  emissiveIntensity={0.72}
                  transparent
                  opacity={0.72}
                />
              </mesh>
              <Text
                anchorX="center"
                anchorY="middle"
                color="#0f172a"
                fontSize={0.1}
                position={[0, height / 2 + 0.16, 0]}
                rotation={[0, -angle + Math.PI / 2, 0]}
              >
                {token.symbol}
              </Text>
            </group>
          );
        })}
        <Text anchorX="center" anchorY="middle" color="#0f172a" fontSize={0.16} position={[0, -0.42, 0]}>
          Token Allocation
        </Text>
      </group>
    </Float>
  );
}
