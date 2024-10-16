import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import RootLayout from "./RootLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProjectsPage } from "./ProjectsPage";
import { MenuDetailPage } from "./MenuDetailPage";
import { ScreenDetailPage } from "./ScreenDetailPage";
import { ScreenSpecificPage } from "./ScreenSpecificPage";
import { MenuProvider } from "./Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ProjectsPage />,
      },
      {
        path: "/screens",
        element: <ScreenDetailPage />,
      },

      {
        path: "/menus",
        element: <MenuDetailPage />,
      },
      {
        path: "/detail/:screenName",
        element: <ScreenSpecificPage />,
      },
    ],
  },
]);
root.render(
  <React.StrictMode>
    <MenuProvider>
      <RouterProvider router={router} />
    </MenuProvider>
  </React.StrictMode>
);

reportWebVitals();
