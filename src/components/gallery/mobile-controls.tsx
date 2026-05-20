import { MousePointer2, Move3D } from "lucide-react";

export default function MobileControls() {
  return (
    <>
      <div className="fixed bottom-4 left-4 z-20 hidden max-w-sm rounded-lg border border-slate-900/10 bg-white/[0.86] p-3 text-sm text-slate-700 shadow-lg backdrop-blur dark:border-white/15 dark:bg-slate-950/[0.78] dark:text-slate-200 md:block">
        <div className="flex gap-3">
          <Move3D aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal-700" />
          <p>Click the scene, then use WASD to move and mouse to look.</p>
        </div>
      </div>
      <div className="fixed bottom-4 left-4 right-4 z-20 rounded-lg border border-white/15 bg-slate-950/82 p-3 text-sm text-white shadow-lg backdrop-blur md:hidden">
        <div className="flex gap-3">
          <MousePointer2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal-200" />
          <p>Mobile gallery controls are simplified for MVP. Tap frames to inspect NFTs.</p>
        </div>
      </div>
    </>
  );
}
