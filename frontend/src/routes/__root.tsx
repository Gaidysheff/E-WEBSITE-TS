import "react-loading-skeleton/dist/skeleton.css";

import * as React from "react";

import {
  Outlet,
  createRootRoute,
  useLocation,
  useParams,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { CurrencyProvider } from "@/store/CurrencyContext";

import { CartContextProvider } from "@/store/CartContext.tsx";
import { CategoryContextProvider } from "@/store/CategoryContext.tsx";
import { SkeletonTheme } from "react-loading-skeleton";
import { ToastContainer } from "react-toastify";
import TypesafeI18n from "@/i18n/i18n-react";
import { UserContextProvider } from "@/store/UserContext.tsx";
import { loadLocale } from "@/i18n/i18n-util.sync"; // Импортируем загрузчик
import { toast } from "react-toastify";
import { type Locales } from "@/i18n/i18n-types"; // Импортируем ваш автогенерируемый тип языков
import { useI18nContext } from "@/i18n/i18n-react";
import { useTheme } from "@/store/ThemeContext";

export const Route = createRootRoute({
  component: RootComponent,
});

// Создаем промежуточный компонент-синхронизатор внутри __root.tsx
// Он нужен, так как использовать useI18nContext можно только ВНУТРИ
// провайдера <TypesafeI18n>
function LanguageSync({ currentLanguage }: { currentLanguage: string }) {
  const { setLocale } = useI18nContext();

  useEffect(() => {
    // Как только TanStack Router изменил URL и currentLanguage поменялся,
    // мы принудительно даем команду typesafe-i18n обновить свой стейт
    // на новый язык!
    setLocale(currentLanguage as any);
  }, [currentLanguage, setLocale]);

  return <Outlet />; // Рендерим дочерние страницы (каталог, корзину и т.д.)
}

function RootComponent() {
  // Получаем параметры из URL (например, для TanStack Router)
  const search = useSearch({ strict: false });

  const navigate = useNavigate();

  const location = useLocation();
  const currentPath = location.pathname;

  const { theme } = useTheme();
  // const theme = localStorage.getItem("theme") || "light";

  // B1. Вытаскиваем динамический параметр lang из TanStack Router!
  // Если пользователь на /ru/cart -> lang будет "ru". Если на /en/cart -> "en"
  const params = useParams({ strict: false });
  const currentLanguage = params.lang || "ru"; // 'ru' как запасной вариант

  // B2. Синхронно загружаем словарь для этого языка
  loadLocale(currentLanguage);

  // A1. Создаем универсальную функцию определения пути к файлу фавикона
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
  // A2. Один useEffect, который отвечает и за смену страниц, и за сворачивание вкладки
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

  useEffect(() => {
    // Если в URL есть ?logout=true
    if (search?.logout) {
      // 1. Прямо из адресной строки браузера смотрим, есть ли там "/ru"
      // Регулярное выражение ищет "/ru/" или "/ru" в начале пути
      // Динамически определяем локаль из URL, но кастуем её к типу Locales
      // Если язык в URL не распознан, принудительно ставим дефолтный (например, 'en')
      const isRussian = /\/(ru)(\/|$)/i.test(window.location.pathname);
      const currentLang: Locales = isRussian ? "ru" : "en";

      // 2. СТРОГИЙ СЛОВАРЬ (Record<Locales, string> гарантирует, что ТУТ
      // обязаны быть ВСЕ языки из типа Locales!)
      const messages: Record<Locales, string> = {
        ru: "Вы успешно вышли из личного кабинета 👋!",
        en: "You have left the authorized area 👋!",
        // Если в будущем тип Locales станет 'ru' | 'en' | 'de',
        // TypeScript ТУТ ЖЕ подчеркнет этот объект красным, требуя добавить ключ 'de'!
      };

      // 3. Дополнительная железная проверка на Exhaustiveness через switch
      // Это нужно на случай, если кто-то обойдет тип Record через анонимный объект
      switch (currentLang) {
        case "ru":
        case "en":
          // Перечисляем все текущие кейсы. Они валидны.
          break;
        default: {
          // Если в Locales добавится 'de', то currentLang сможет быть 'de'.
          // В этот момент TypeScript увидит, что мы пытаемся передать 'de' в функцию,
          // которая принимает ТОЛЬКО тип 'never', и проект НЕ СОБЕРЕТСЯ!
          const strictNever: never = currentLang;
          throw new Error(`Unhandled language: ${strictNever}`);
        }
      }

      // 4. Показываем тост на реальном языке страницы
      toast.info(messages[currentLang]);

      // 5. Сразу мягко убираем параметр из URL, чтобы ссылка снова стала чистой
      navigate({
        search: {},
        replace: true,
      } as any); // as any нужен, если роутер требует строго типизированный
      // search для текущего роута
    }
  }, [search?.logout]);
  // currentLang в зависимостях, чтобы React реагировал на смену языка

  return (
    <React.Fragment>
      <TypesafeI18n locale={currentLanguage}>
        <CurrencyProvider>
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
                  {/* <Outlet /> */}

                  {/* Вместо прямого <Outlet /> вставляем наш синхронизатор */}
                  <LanguageSync currentLanguage={currentLanguage} />
                </SkeletonTheme>
              </CategoryContextProvider>
            </UserContextProvider>
          </CartContextProvider>
        </CurrencyProvider>
      </TypesafeI18n>
    </React.Fragment>
  );
}
