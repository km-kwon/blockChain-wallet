import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import EntranceSign from "@/components/gallery/entrance-sign";
import NftFrame from "@/components/gallery/nft-frame";
import PlayerControls from "@/components/gallery/player-controls";
import Room from "@/components/gallery/room";
import TokenHologram from "@/components/gallery/token-hologram";
import type { NftItem } from "@/types/nft";
import type { WalletData } from "@/types/wallet";

type GallerySceneProps = {
  wallet: WalletData;
  selectedNft: NftItem | null;
  onSelectNft: (nft: NftItem) => void;
  theme: "light" | "dark";
};

type FramePlacement = {
  nft: NftItem;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

export default function GalleryScene({ wallet, selectedNft, onSelectNft, theme }: GallerySceneProps) {
  const frames = useMemo(() => createFramePlacements(wallet.nfts), [wallet.nfts]);
  const isDark = theme === "dark";

  return (
    <Canvas
      camera={{ fov: 60, position: [0, 1.7, 5.3] }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      shadows
    >
      <color args={[isDark ? "#0f172a" : "#f8fafc"]} attach="background" />
      <fog args={[isDark ? "#0f172a" : "#f8fafc", 8, 17]} attach="fog" />
      <ambientLight intensity={isDark ? 0.28 : 0.38} />
      <hemisphereLight args={[isDark ? "#c7d2fe" : "#ffffff", isDark ? "#1e293b" : "#c0a172", 0.5]} />
      <spotLight
        angle={0.42}
        castShadow
        intensity={3}
        penumbra={0.62}
        position={[0, 3.7, 1.6]}
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight angle={0.34} intensity={1.25} penumbra={0.8} position={[-4, 3.35, -1.8]} />
      <spotLight angle={0.34} intensity={1.25} penumbra={0.8} position={[4, 3.35, -1.8]} />
      <Suspense fallback={null}>
        <Room theme={theme} />
        <EntranceSign profile={wallet.profile} />
        <TokenHologram tokens={wallet.tokens} />
        {frames.map((frame) => (
          <NftFrame
            isSelected={selectedNft?.id === frame.nft.id}
            key={frame.nft.id}
            nft={frame.nft}
            onSelect={onSelectNft}
            position={frame.position}
            rotation={frame.rotation}
            scale={frame.scale}
          />
        ))}
      </Suspense>
      <PlayerControls enabled={!selectedNft} />
    </Canvas>
  );
}

function createFramePlacements(nfts: NftItem[]): FramePlacement[] {
  const displayed = nfts.slice(0, 14);
  const sideZ = [-4.2, -2.6, -1, 0.6, 2.2, 3.8];

  return displayed.map((nft, index) => {
    const rareScale = nft.isRare || (nft.rarityRank !== undefined && nft.rarityRank <= 500) ? 1.28 : 1;

    if (index < 6) {
      return {
        nft,
        position: [-5.72, 1.85, sideZ[index]],
        rotation: [0, Math.PI / 2, 0],
        scale: rareScale,
      };
    }

    if (index < 12) {
      return {
        nft,
        position: [5.72, 1.85, sideZ[index - 6]],
        rotation: [0, -Math.PI / 2, 0],
        scale: rareScale,
      };
    }

    return {
      nft,
      position: [index === 12 ? -1.45 : 1.45, 1.9, -5.72],
      rotation: [0, 0, 0],
      scale: rareScale * 1.08,
    };
  });
}
