import * as React from "react";

import { Outlet, createRootRoute } from "@tanstack/react-router";

import Footer from "./../components/footer/Footer.tsx";
import NavBar from "./../components/navbar/NavBar.tsx";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <NavBar />
      <div className="container bg-red-200">
        <Outlet />
      </div>

      <Footer />
    </React.Fragment>
  );
}
