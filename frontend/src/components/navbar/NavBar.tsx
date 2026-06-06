import FilterDrawer from "@/components/filter/FilterDrawer.tsx";
import { LayoutGrid } from "lucide-react";
import { AppLink as Link } from "@/components/appLink/AppLink";
import MobileNavbar from "./MobileNavbar";
import NavItems from "./NavItems";
import SearchButton from "./SearchButton";
import SearchForm from "./SearchForm";
import SettingsDrawer from "@/components/settings/SettingsDrawer.tsx";
import ThemeSwitch from "./ThemeSwitch";
import { useI18nContext } from "@/i18n/i18n-react";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTheme } from "@/store/ThemeContext";

const NavBar = () => {
  const [showSearchForm, setShowSearchForm] = useState(false);

  const { theme } = useTheme();

  // Получаем доступ к глобальному состоянию роутера
  const router = useRouter();

  const { locale } = useI18nContext();

  // Определяем, на какой язык мы хотим переключить пользователя
  const nextLang = locale === "ru" ? "en" : "ru";

  const handleSearch = () => {
    setShowSearchForm((curr) => !curr);
  };

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
    <>
      <nav
        className="bg-card sticky top-0 z-20 w-full py-4
        border-b border-primaryLight"
      >
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="w-full flex justify-between items-center">
              <Link to="/">
                <h1
                  className="text-2xl font-extrabold text-primaryDark
                  hover:text-primaryDark/50 hover:scale-110
                  transition duration-300"
                >
                  E-Shop
                </h1>
              </Link>

              <div className="max-lg:block hidden">
                <SearchButton
                  handleSearch={handleSearch}
                  showSearchForm={showSearchForm}
                />
              </div>

              <div className="max-lg:hidden">
                <SearchForm />
              </div>

              <Link
                to="/products"
                search={{ isCatalog: true }}
                className="text-primaryDark hover:text-primaryDark/50
                  hover:scale-110 transition duration-300 w-[40px]"
              >
                <LayoutGrid size={40} />
              </Link>

              <SettingsDrawer />

              <FilterDrawer />

              <div className="max-md:hidden">
                <NavItems />
              </div>

              <div className="max-md:block hidden">
                <div className="flex items-center">
                  <MobileNavbar />
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleLanguageChange}
                className="flex items-center justify-center p-2 rounded-full
                hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300
                active:scale-95"
                title={
                  locale === "ru"
                    ? "Switch to English"
                    : "Переключить на Русский"
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
            </div>

            {theme === "light" ? (
              <ThemeSwitch id="dark-btn" />
            ) : (
              <ThemeSwitch id="light-btn" />
            )}
          </div>
        </div>
      </nav>

      {showSearchForm && (
        <div className="w-[300px] mx-auto mt-4 max-lg:flex justify-center hidden">
          <SearchForm />
        </div>
      )}
    </>
  );
};

export default NavBar;
