import { Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { SRGBColorSpace, Texture, TextureLoader } from "three";
import type { NftItem } from "@/types/nft";

type NftFrameProps = {
  nft: NftItem;
  isSelected: boolean;
  onSelect: (nft: NftItem) => void;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

export default function NftFrame({ nft, isSelected, onSelect, position, rotation, scale }: NftFrameProps) {
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<Texture | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const frameWidth = nft.isRare ? 1.28 : 1.05;
  const frameHeight = nft.isRare ? 1.48 : 1.22;
  const frameColor = isSelected || hovered ? "#14b8a6" : "#111827";

  useEffect(() => {
    let ignore = false;

    setTexture(null);
    setLoadFailed(false);

    if (!nft.imageUrl) {
      setLoadFailed(true);
      return undefined;
    }

    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      nft.imageUrl,
      (loadedTexture) => {
        if (ignore) {
          loadedTexture.dispose();
          return;
        }

        loadedTexture.colorSpace = SRGBColorSpace;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        if (!ignore) {
          setLoadFailed(true);
          setTexture(null);
        }
      },
    );

    return () => {
      ignore = true;
    };
  }, [nft.imageUrl]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onSelect(nft);
  }

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(true);
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow position={[0, 0, -0.06]} receiveShadow>
        <boxGeometry args={[frameWidth + 0.2, frameHeight + 0.2, 0.1]} />
        <meshStandardMaterial color={frameColor} metalness={0.15} roughness={0.35} />
      </mesh>
      <mesh
        castShadow
        onClick={handleClick}
        onPointerOut={() => setHovered(false)}
        onPointerOver={handlePointerOver}
        position={[0, 0.03, 0.01]}
      >
        <planeGeometry args={[frameWidth, frameHeight]} />
        <meshStandardMaterial color={texture ? "#ffffff" : "#e2e8f0"} map={texture ?? undefined} roughness={0.42} />
      </mesh>
      {!texture ? (
        <Text
          anchorX="center"
          anchorY="middle"
          color="#334155"
          fontSize={0.085}
          maxWidth={frameWidth * 0.74}
          position={[0, 0.04, 0.035]}
        >
          {loadFailed ? "Image unavailable" : "Loading artwork"}
        </Text>
      ) : null}
      <mesh position={[0, -frameHeight / 2 - 0.16, 0]}>
        <boxGeometry args={[frameWidth * 0.76, 0.16, 0.04]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      <Text
        anchorX="center"
        anchorY="middle"
        color="#111827"
        fontSize={0.075}
        maxWidth={frameWidth * 0.68}
        position={[0, -frameHeight / 2 - 0.16, 0.035]}
      >
        {nft.name}
      </Text>
    </group>
  );
}
