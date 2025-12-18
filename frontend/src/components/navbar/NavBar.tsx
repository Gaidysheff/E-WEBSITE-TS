import { Link } from "@tanstack/react-router";

type Props = {};

const NavBar = (props: Props) => {
  return (
    <>
      <nav
        className="bg-card sticky top-0 z-20 w-full py-4
        border-b border-primaryLight"
      >
        <div className="container">
          <div className="flex justify-between items-center main-max-width">
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
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
