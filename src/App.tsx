import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "@/routes/dashboard-page";
import GalleryPage from "@/routes/gallery-page";
import LandingPage from "@/routes/landing-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/:address",
    element: <DashboardPage />,
  },
  {
    path: "/:address/gallery",
    element: <GalleryPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
