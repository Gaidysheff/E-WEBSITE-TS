import * as React from "react";

import { Outlet, createRootRoute } from "@tanstack/react-router";

import Footer from "./../components/footer/Footer.tsx";
import NavBar from "./../components/navbar/NavBar.tsx";
import { ThemeProvider } from "@/store/ThemeContext.tsx";
import { ToastContainer } from "react-toastify";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const theme = localStorage.getItem("theme");

  return (
    <React.Fragment>
      <ThemeProvider>
        {theme === "light" ? (
          <ToastContainer
            position="top-center"
            theme="dark"
            // hideProgressBar={true}
            autoClose={2000}
            className="text-center"
          />
        ) : (
          <ToastContainer
            position="top-center"
            theme="light"
            // hideProgressBar={true}
            autoClose={2000}
            className="text-center"
          />
        )}
        <NavBar />
        <div className="container">
          <Outlet />
        </div>
        <Footer />
      </ThemeProvider>
    </React.Fragment>
  );
}
