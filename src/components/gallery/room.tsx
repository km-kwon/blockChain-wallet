type RoomProps = {
  theme: "light" | "dark";
};

export default function Room({ theme }: RoomProps) {
  const isDark = theme === "dark";
  const wallColor = isDark ? "#1f2937" : "#f6f8fb";
  const floorColor = isDark ? "#3f3a34" : "#d8c7aa";

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={floorColor} roughness={0.78} />
      </mesh>
      <gridHelper
        args={[12, 18, isDark ? "#64748b" : "#b99b6b", isDark ? "#334155" : "#eadfcd"]}
        position={[0, 0.012, 0]}
      />
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={isDark ? "#111827" : "#f8fafc"} roughness={0.92} />
      </mesh>
      <Wall color={wallColor} position={[0, 2, -6]} scale={[12, 4, 0.18]} />
      <Wall color={wallColor} position={[-6, 2, 0]} scale={[0.18, 4, 12]} />
      <Wall color={wallColor} position={[6, 2, 0]} scale={[0.18, 4, 12]} />
      <mesh position={[0, 2, 6]} receiveShadow scale={[12, 4, 0.12]}>
        <boxGeometry />
        <meshStandardMaterial color={isDark ? "#111827" : "#f2f5f8"} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.05, 5.86]} scale={[2.2, 0.08, 0.22]}>
        <boxGeometry />
        <meshStandardMaterial color="#8f7656" roughness={0.64} />
      </mesh>
    </group>
  );
}

function Wall({
  color,
  position,
  scale,
}: {
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh position={position} receiveShadow scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}
