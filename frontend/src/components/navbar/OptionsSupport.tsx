import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui-modified/tooltip";

import CurrencySelector from "@/components/currency/CurrencySelector.tsx";
import ThemeSwitch from "./ThemeSwitch";
import { useI18nContext } from "@/i18n/i18n-react";
import { useRouter } from "@tanstack/react-router";
import { useTheme } from "@/store/ThemeContext";

const OptionsSupport = () => {
  const { theme } = useTheme();

  // Получаем доступ к глобальному состоянию роутера
  const router = useRouter();

  const { locale } = useI18nContext();

  // Определяем, на какой язык мы хотим переключить пользователя
  const nextLang = locale === "ru" ? "en" : "ru";

  const handleLanguageChange = async () => {
    try {
      // 1. Берем текущий реальный путь из адресной строки
      // (например, "/en/products/product-1")
      const currentPathname = router.state.location.pathname;

      // 2. Заменяем языковой префикс в начале строки пути
      let newPathname = currentPathname;
      if (currentPathname.startsWith(`/${locale}`)) {
        newPathname = currentPathname.replace(`/${locale}`, `/${nextLang}`);
      }

      // 3. Переходим по новому чистому адресу, сохраняя
      //  все query-параметры (фильтры)
      await router.navigate({
        to: newPathname,
        // Передаем текущие search-параметры как есть
        search: (prev: any) => prev,
      });
    } catch (error) {
      console.error("Ошибка при смене языка:", error);
    }
  };

  return (
    <div
      className="flex justify-end items-center gap-4
      max-md:w-full max-md:justify-around"
    >
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleLanguageChange}
              className="flex items-center justify-center p-2 rounded-full
                hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300
                active:scale-95"
              title={
                locale === "ru" ? "Switch to English" : "Переключить на Русский"
              }
            >
              {locale === "ru" ? (
                // Если сейчас русский — показываем американский флаг
                // для перехода на английский
                <span className="text-2xl select-none leading-none">🇺🇸</span>
              ) : (
                // Если сейчас английский — показываем русский флаг
                <span className="text-2xl select-none leading-none">🇷🇺</span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent mainColorTooltip side="bottom">
            <p>Язык</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* ------------------------------------- */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <CurrencySelector />
          </div>
        </TooltipTrigger>
        <TooltipContent mainColorTooltip side="bottom">
          <p>Валюта</p>
        </TooltipContent>
      </Tooltip>

      {/* ------------------------------------ */}
      <Tooltip>
        <TooltipTrigger asChild>
          {theme === "light" ? (
            <ThemeSwitch id="dark-btn" />
          ) : (
            <ThemeSwitch id="light-btn" />
          )}
        </TooltipTrigger>
        <TooltipContent mainColorTooltip side="bottom">
          <p>Тема</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default OptionsSupport;
