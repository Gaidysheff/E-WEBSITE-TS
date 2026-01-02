import { Link, useNavigate } from "@tanstack/react-router";

import { FaCartShopping } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { logout } from "@/api/endpoints_auth";

type Props = {
  mobile?: boolean;
};
const NavItems = ({ mobile }: Props) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate({ to: `/` });
  };

  const loginHandler = () => {
    navigate({ to: `/login` });
  };

  const registerHandler = () => {
    navigate({ to: `/register` });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-6",
        mobile ? "flex-col" : "flex-row"
      )}
    >
      <div className="flex items-center justify-center gap-6">
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
          </div>

          <div
            className="text-lg font-medium text-primaryDark 
            group-hover/profile:text-primaryDark/50 "
          >
            {/* User's Name */}
            Eugene
          </div>
        </Link>

        <button type="button" className="nav-btn" onClick={logoutHandler}>
          Logout
        </button>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button type="button" className="nav-btn" onClick={loginHandler}>
          Login
        </button>{" "}
        <button type="button" className="nav-btn" onClick={registerHandler}>
          Sign up
        </button>
      </div>

      <Link to="/">
        <div
          className="relative flex items-center h-[60px] w-[60px]
          justify-center cursor-pointer group/cart hover:scale-110"
        >
          <FaCartShopping
            className="text-4xl text-primaryDark
            hover:text-primaryDark/50 transition duration-300"
          />
          <span
            className="absolute top-0 right-0 px-3 py-1 bg-red-500
              rounded-full text-white group-hover/cart:bg-red-400"
          >
            3
          </span>
        </div>
      </Link>
    </div>
  );
};

export default NavItems;
