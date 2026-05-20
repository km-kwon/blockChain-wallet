import { lazy, Suspense, useEffect } from "react";
import type { ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppErrorBoundary from "@/components/shared/app-error-boundary";
import RouteErrorFallback from "@/components/shared/route-error-fallback";
import { useUiStore } from "@/store/ui-store";

const LandingPage = lazy(() => import("@/routes/landing-page"));
const DashboardPage = lazy(() => import("@/routes/dashboard-page"));
const GalleryPage = lazy(() => import("@/routes/gallery-page"));
const NotFoundPage = lazy(() => import("@/routes/not-found-page"));

function withPageFallback(element: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: withPageFallback(<LandingPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: "/:address",
    element: withPageFallback(<DashboardPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: "/:address/gallery",
    element: withPageFallback(<GalleryPage />),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: "*",
    element: withPageFallback(<NotFoundPage />),
    errorElement: <RouteErrorFallback />,
  },
]);

export default function App() {
  return (
    <AppErrorBoundary>
      <ThemeController />
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}

function ThemeController() {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("wallet-gallery-theme", theme);
  }, [theme]);

  return null;
}

function PageFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
    </main>
  );
}
