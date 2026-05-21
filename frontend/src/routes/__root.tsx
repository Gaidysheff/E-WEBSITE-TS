import "react-loading-skeleton/dist/skeleton.css";

import * as React from "react";

import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";

import { CartContextProvider } from "@/store/CartContext.tsx";
import { CategoryContextProvider } from "@/store/CategoryContext.tsx";
import { SkeletonTheme } from "react-loading-skeleton";
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "@/store/UserContext.tsx";
import { useTheme } from "@/store/ThemeContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();

  const { theme } = useTheme();
  // const theme = localStorage.getItem("theme") || "light";

  const currentPath = location.pathname;

  // 1. Создаем универсальную функцию определения пути к файлу фавикона
  const getFaviconPath = useCallback((path: string, isHidden: boolean) => {
    if (path.includes("/products")) {
      return isHidden ? "/gift-inactive.svg" : "/gift.svg";
    }
    if (path.includes("/cart")) {
      return isHidden
        ? "/shopping-basket-inactive.svg"
        : "/shopping-basket.svg";
    }
    return isHidden ? "/favicon-inactive.svg" : "/favicon.svg";
  }, []);

  // ------------------ Версия стабильна только для FireFox ------------
  // 2. Один useEffect, который отвечает и за смену страниц, и за сворачивание вкладки
  useEffect(() => {
    // 1. Находим единственный постоянный тег фавикона
    const faviconLink = document.querySelector(
      "link[rel*='icon']",
    ) as HTMLLinkElement;
    if (!faviconLink) return;

    // Функция, которая мгновенно обновляет href на основе текущего состояния
    const updateFavicon = () => {
      const nextHref = getFaviconPath(currentPath, document.hidden);

      // КРИТИЧЕСКИ ВАЖНО: Меняем href ТОЛЬКО если он РЕАЛЬНО отличается.
      // Это защитит от бесконечных микро-обновлений и мерцания в Chromium.
      if (faviconLink.getAttribute("href") !== nextHref) {
        faviconLink.setAttribute("href", nextHref);
      }
    };

    // Вызываем при смене страницы
    updateFavicon();

    // Слушаем переключение вкладок
    document.addEventListener("visibilitychange", updateFavicon);

    return () => {
      document.removeEventListener("visibilitychange", updateFavicon);
    };
  }, [currentPath, getFaviconPath]); // Никаких лишних зависимостей
  // Эффект перезапустится при смене страницы и перенастроит слушатель на новый путь

  // ------------------ Вторая Версия ------------

  // useEffect(() => {
  //   const faviconLink = document.querySelector(
  //     "link[rel*='icon']",
  //   ) as HTMLLinkElement;
  //   if (!faviconLink) return;

  //   // Функция, которая принудительно ставит "активный" фавикон для текущего URL
  //   const setContextActive = () => {
  //     const nextHref = getFaviconPath(currentPath, false);
  //     if (faviconLink.getAttribute("href") !== nextHref) {
  //       faviconLink.setAttribute("href", nextHref);
  //     }
  //   };

  //   // Функция, которая принудительно ставит "неактивный" фавикон для текущего URL
  //   const setContextInactive = () => {
  //     const nextHref = getFaviconPath(currentPath, true);
  //     if (faviconLink.getAttribute("href") !== nextHref) {
  //       faviconLink.setAttribute("href", nextHref);
  //     }
  //   };

  //   // 1. При смене маршрута или первой загрузке — фавикон всегда активный
  //   setContextActive();

  //   // 2. Для Chromium-браузеров используем фокус окна.
  //   // Событие window 'blur' срабатывает в ту самую долю секунды, когда пользователь
  //   // КЛИКАЕТ на другую вкладку, но текущая вкладка ЕЩЕ НЕ УСНУЛА.
  //   window.addEventListener("blur", setContextInactive);
  //   window.addEventListener("focus", setContextActive);

  //   // 3. Для Firefox и мобильных браузеров оставляем visibilitychange как подстраховку
  //   const handleVisibility = () => {
  //     if (document.hidden) {
  //       setContextInactive();
  //     } else {
  //       setContextActive();
  //     }
  //   };
  //   document.addEventListener("visibilitychange", handleVisibility);

  //   return () => {
  //     window.removeEventListener("blur", setContextInactive);
  //     window.removeEventListener("focus", setContextActive);
  //     document.removeEventListener("visibilitychange", handleVisibility);
  //   };
  // }, [currentPath, getFaviconPath]);

  return (
    <React.Fragment>
      <CartContextProvider>
        <UserContextProvider>
          <CategoryContextProvider>
            <SkeletonTheme baseColor="#abababff" highlightColor="#eaeaeaff">
              {/* ОДИН контейнер тостов с динамической темой */}
              <ToastContainer
                position="top-center"
                theme={theme === "light" ? "dark" : "light"}
                // Инверсия темы для контраста тостов
                autoClose={2000}
                // hideProgressBar={true}
                className="text-center"
              />
              {/* ТОЛЬКО ОДИН OUTLET НА ВЕСЬ КОРЕНЬ */}
              <Outlet />
            </SkeletonTheme>
          </CategoryContextProvider>
        </UserContextProvider>
      </CartContextProvider>
    </React.Fragment>
  );
}
