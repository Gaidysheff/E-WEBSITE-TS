import "react-loading-skeleton/dist/skeleton.css";

import * as React from "react";

import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";

import { CategoryContextProvider } from "@/store/CategoryContext.tsx";
import Footer from "@/components/footer/Footer.tsx";
import NavBar from "@/components/navbar/NavBar.tsx";
import NoNavbarOutlet from "@/components/noNavbarOutlet/NoNavbarOutlet";
import { SkeletonTheme } from "react-loading-skeleton";
import { ThemeProvider } from "@/store/ThemeContext.tsx";
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "@/store/UserContext.tsx";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const theme = localStorage.getItem("theme");

  const noNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.includes("password") ||
    location.pathname === "/success" ||
    location.pathname === "/failed";

  return (
    <React.Fragment>
      <ThemeProvider>
        <SkeletonTheme baseColor="#abababff" highlightColor="#eaeaeaff">
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
          {noNavbar ? (
            <NoNavbarOutlet location={location} />
          ) : (
            // Standard Pages with NavBar and Footer
            <UserContextProvider>
              <CategoryContextProvider>
                <NavBar />
                <div className="container">
                  <Outlet />
                </div>
                <Footer />
              </CategoryContextProvider>
            </UserContextProvider>
          )}
        </SkeletonTheme>
      </ThemeProvider>
    </React.Fragment>
  );
}
