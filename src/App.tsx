import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const LandingPage = lazy(() => import("@/routes/landing-page"));
const DashboardPage = lazy(() => import("@/routes/dashboard-page"));
const GalleryPage = lazy(() => import("@/routes/gallery-page"));

function withPageFallback(element: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: withPageFallback(<LandingPage />),
  },
  {
    path: "/:address",
    element: withPageFallback(<DashboardPage />),
  },
  {
    path: "/:address/gallery",
    element: withPageFallback(<GalleryPage />),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

function PageFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
    </main>
  );
}
