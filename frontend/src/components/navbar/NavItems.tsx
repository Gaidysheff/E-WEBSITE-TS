import { useLocation, useNavigate } from "@tanstack/react-router";

import { BASE_URL } from "@/api/api.ts";
import { FaCartShopping } from "react-icons/fa6";
import { AppLink as Link } from "@/components/appLink/AppLink";
import { cn } from "@/lib/utils";
import { logout } from "@/api/endpoints_auth";
import { useCart } from "@/store/CartContext.tsx";
import { useI18nContext } from "@/i18n/i18n-react";
import { useUser } from "@/store/UserContext.tsx";

type Props = {
  mobile?: boolean;
};

const NavItems = ({ mobile }: Props) => {
  const { cartItemsCount, cartCode } = useCart();

  const { user, isLoading } = useUser();

  const imgURL = `${BASE_URL}${user?.image}`;

  const navigate = useNavigate();
  const { locale } = useI18nContext();
  // Получаем живой текущий язык ('ru' или 'en')

  const token = !!localStorage.getItem("Token");

  const location = useLocation();

  const logoutHandler = async () => {
    await logout();
    // Перенаправляем на главную страницу текущего языка (например, /ru или /en)
    await navigate({
      to: "/$lang",
      params: { lang: locale },
    });
  };

  const loginHandler = async () => {
    // Перенаправляем на страницу логина текущего языка (/ru/login)
    await navigate({
      to: "/$lang/login",
      params: { lang: locale },
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
      params: { lang: locale },
    });
  };

  if (isLoading) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
    // Лоадер-скелетон для авы
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-6",
        mobile ? "flex-col" : "flex-row",
      )}
    >
      {token ? (
        <div
          className={cn(
            "flex items-center justify-center gap-6",
            mobile ? "flex-col" : "flex-row",
          )}
        >
          <Link
            to="/profile"
            className="flex items-center justify-between group/profile
            transition duration-300 hover:scale-110"
          >
            <div
              className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 
              border-primaryDark shadow-md mr-3"
            >
              {/* Profile picture container */}

              {/* {user?.image && ( */}

              {user && (
                <img className="grayscale" src={imgURL} alt="User's image" />
              )}
            </div>

            <div
              className="text-lg font-medium text-primaryDark 
              group-hover/profile:text-primaryDark/50 "
            >
              {/* User's Name */}
              {user?.first_name || user?.last_name
                ? user?.first_name || user?.last_name
                : user?.email.split("@")[0]}
            </div>
          </Link>

          <button type="button" className="nav-btn" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center gap-6",
            mobile ? "flex-col" : "flex-row",
          )}
        >
          <button type="button" className="nav-btn" onClick={loginHandler}>
            Login
          </button>{" "}
          <button type="button" className="nav-btn" onClick={registerHandler}>
            Sign up
          </button>
        </div>
      )}

      {/* <Link from="/" to={`/cart/${cartCode}`}> */}
      <Link
        to="/cart/$cartcode"
        params={{ cartcode: cartCode }}
        // Передаем cartcode в нижнем регистре, как в файле маршрута!
      >
        <div
          className="relative flex items-center h-[60px] w-[60px]
            justify-center cursor-pointer group/cart hover:scale-110"
        >
          <FaCartShopping
            className="text-4xl text-primaryDark
              hover:text-primaryDark/50 transition duration-300"
          />

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
    </div>
  );
};

export default NavItems;
