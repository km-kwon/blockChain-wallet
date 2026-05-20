import { Text } from "@react-three/drei";
import { shortenAddress } from "@/lib/format";
import type { EnsProfile } from "@/types/wallet";

type EntranceSignProps = {
  profile: EnsProfile;
};

export default function EntranceSign({ profile }: EntranceSignProps) {
  const display = profile.ensName ?? profile.displayName;
  const address = shortenAddress(profile.resolvedAddress, 8, 6);

  return (
    <group position={[0, 2.35, 5.78]} rotation={[0, Math.PI, 0]}>
      <mesh>
        <boxGeometry args={[3.6, 0.92, 0.08]} />
        <meshStandardMaterial color="#111827" roughness={0.45} />
      </mesh>
      <Text
        anchorX="center"
        anchorY="middle"
        color="#f8fafc"
        fontSize={0.2}
        maxWidth={3}
        position={[0, 0.15, -0.055]}
      >
        {display}
      </Text>
      <Text
        anchorX="center"
        anchorY="middle"
        color="#7dd3fc"
        fontSize={0.11}
        maxWidth={3}
        position={[0, -0.18, -0.055]}
      >
        {address}
      </Text>
    </group>
  );
}
