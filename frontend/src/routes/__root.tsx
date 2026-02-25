import "react-loading-skeleton/dist/skeleton.css";

import * as React from "react";

import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";

import { CartContextProvider } from "@/store/CartContext.tsx";
import { CategoryContextProvider } from "@/store/CategoryContext.tsx";
import Favicon from "@/components/favicon/Favicon.tsx";
import FaviconProduct from "@/components/favicon/FaviconProduct";
import FaviconShoppingBasket from "@/components/favicon/FaviconProduct";
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

  const currentPath = location.pathname;

  // if (currentPathname.includes("products")) {}
  const noNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.includes("password") ||
    location.pathname === "/success" ||
    location.pathname === "/failed";

  return (
    <React.Fragment>
      <ThemeProvider>
        <CartContextProvider>
          <SkeletonTheme baseColor="#abababff" highlightColor="#eaeaeaff">
            {currentPath.includes("/products") ? (
              <FaviconProduct />
            ) : currentPath.includes("/cart") ? (
              <FaviconShoppingBasket />
            ) : (
              <Favicon />
            )}

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
                  <div className="h-screen">
                    <NavBar />
                    <div className="container min-h-6/10">
                      <Outlet />
                    </div>
                    <Footer />
                  </div>
                </CategoryContextProvider>
              </UserContextProvider>
            )}
          </SkeletonTheme>
        </CartContextProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
