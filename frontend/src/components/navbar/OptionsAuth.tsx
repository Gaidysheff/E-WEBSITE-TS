import { ClipboardPen, LogIn, LogOut, ShoppingCart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui-modified/tooltip";

import { BASE_URL } from "@/api/api.ts";
import { AppLink as Link } from "@/components/appLink/AppLink";
import { logout } from "@/api/endpoints_auth";
import { useAppNavigate } from "@/hooks/useAppNavigate.ts";
import { useCart } from "@/store/CartContext.tsx";
import { useI18nContext } from "@/i18n/i18n-react";
import { useLocation } from "@tanstack/react-router";
import { useUser } from "@/store/UserContext.tsx";

// import { FaCartShopping } from "react-icons/fa6";

// import { cn } from "@/lib/utils";

// type Props = {
//   mobile?: boolean;
// };

// const OptionsAuth = ({ mobile }: Props) => {
const OptionsAuth = () => {
  const { locale } = useI18nContext();

  const { cartItemsCount, cartCode, clearCartAndLogout } = useCart();

  const { user, isLoading } = useUser();

  const imgURL = `${BASE_URL}${user?.image}`;

  const navigate = useAppNavigate(); // Наш умный навигатор

  const token = !!localStorage.getItem("Token");

  const location = useLocation();

  const logoutHandler = async () => {
    await logout();

    // 2. Вызываем нашу функцию полной очистки стейтов корзины

    // clearCart();

    // Чистим и корзину, и токен
    clearCartAndLogout();

    // Мгновенный и чистый переход роутера без перезагрузки страницы
    // Параметр ?logout=true скажет главной странице, что нужно показать тост
    navigate({ to: `/${locale}`, search: { logout: true } });
  };

  const loginHandler = async () => {
    // Перенаправляем на страницу логина текущего языка (/ru/login)
    await navigate({
      to: "/$lang/login",
      // params: { lang: locale },
      // Запоминаем текущую страницу (например, главную или карточку товара)
      search: {
        redirect: location.href,
      },
    });
  };

  const registerHandler = async () => {
    // Перенаправляем на страницу регистрации текущего языка (/ru/register)
    await navigate({
      to: "/$lang/register",
      // params: { lang: locale },
    });
  };

  if (isLoading) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
    // Лоадер-скелетон для авы
  }

  return (
    <>
      <hr className="w-[75%] min-lg:hidden" />
      <div
        className="flex items-center justify-center gap-6
        flex-col min-lg:flex-row"
      >
        <div>
          {token ? (
            <div className="flex gap-6">
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    to="/$lang/profile"
                    className="flex items-center justify-between group/profile
                    transition duration-300 hover:scale-110"
                  >
                    <div
                      className="w-[50px] h-[50px] rounded-full overflow-hidden
                      border-2 border-primaryDark shadow-md mr-3"
                    >
                      {/* Profile picture container */}

                      {/* {user?.image && ( */}

                      {user && (
                        <img
                          className="grayscale"
                          src={imgURL}
                          alt="User's image"
                        />
                      )}
                    </div>

                    <div
                      className="text-lg font-medium text-primaryDark 
                  group-hover/profile:text-primaryDark/50 "
                    >
                      {/* User's Name */}
                      {user?.firstName || user?.lastName
                        ? user?.firstName || user?.lastName
                        : user?.username
                          ? user?.username
                          : // Сначала проверяем наличие email, и только потом split
                            user?.email
                            ? user.email.split("@")[0]
                            : "Гость"}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent mainColorTooltip side="bottom">
                  <p>User's Profile</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <button
                    type="button"
                    className="text-primaryDark hover:text-primaryDark/50
                    hover:scale-110 transition duration-300 w-[40px]"
                    onClick={logoutHandler}
                  >
                    <LogOut size={40} />
                  </button>
                </TooltipTrigger>
                <TooltipContent mainColorTooltip side="bottom">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>

              {/* <button type="button" className="nav-btn" onClick={logoutHandler}>
                Logout
              </button> */}
            </div>
          ) : (
            <div className="flex gap-6">
              <Tooltip>
                <TooltipTrigger>
                  <button
                    type="button"
                    className="text-primaryDark hover:text-primaryDark/50
                    hover:scale-110 transition duration-300 w-[40px]"
                    onClick={loginHandler}
                  >
                    <LogIn size={40} />
                  </button>
                </TooltipTrigger>
                <TooltipContent mainColorTooltip side="bottom">
                  <p>LogIn</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <button
                    type="button"
                    className="text-primaryDark hover:text-primaryDark/50
                    hover:scale-110 transition duration-300 w-[40px]"
                    onClick={registerHandler}
                  >
                    <ClipboardPen size={40} />
                  </button>
                </TooltipTrigger>
                <TooltipContent mainColorTooltip side="bottom">
                  <p>SignUp</p>
                </TooltipContent>
              </Tooltip>

              {/* <button type="button" className="nav-btn" onClick={loginHandler}>
                Login
              </button>{" "}
              <button type="button" className="nav-btn" onClick={registerHandler}>
                Sign up
              </button> */}
            </div>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger>
            <Link
              to="/cart/$cartcode"
              params={{ cartcode: cartCode }}
              // Передаем cartcode в нижнем регистре, как в файле маршрута!
            >
              <div
                className="relative flex items-center h-[60px] w-[60px]
              justify-center cursor-pointer group/cart hover:scale-110"
              >
                <ShoppingCart
                  className="text-primaryDark hover:text-primaryDark/50
              transition duration-300"
                  size={40}
                />
                {/* <FaCartShopping
              className="text-4xl text-primaryDark
                hover:text-primaryDark/50 transition duration-300"
            /> */}
                {cartItemsCount == 0 || (
                  <span
                    className="absolute top-0 right-0 px-3 py-1 bg-myMainColor
                  rounded-full text-white group-hover/cart:bg-red-400"
                  >
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent mainColorTooltip side="bottom">
            <p>Корзина</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <hr className="w-[75%] min-lg:hidden" />
    </>
  );
};

export default OptionsAuth;
