// import Logo from "@/assets/images/shared/Kalika-Sign.svg";

// import Logo from "@/assets/images/shared/Kalika-LogoSign-dark.svg";

import LogoSwitch from "./LogoSwitch";
import Waves from "@/components/decor/Waves.tsx";
import { useTheme } from "@/store/ThemeContext";

// import { useEffect } from "react";

const Introduction = () => {
  const { theme } = useTheme();

  // useEffect(() => {
  //   function updateLogo() {
  //     const logo = document.querySelector(".logo");
  //     console.log("🚀 ~ updateLogo ~ logo:", logo);
  //     if (theme === "light") {
  //       logo?.setAttribute("color", "#ffff00");
  //     } else {
  //       logo?.setAttribute("color", "#004cff");
  //     }
  //   }
  //   updateLogo();
  // }, [theme]);

  return (
    <section>
      <div className="pt-20 bg-myMainColor/15">
        {/* <div className="pt-20 bg-linear-to-r from-myMainColor/15 to-myMainColor/01"> */}
        <div className="container flex flex-col">
          {theme === "light" ? (
            <LogoSwitch id="dark" />
          ) : (
            <LogoSwitch id="light" />
          )}

          {/* <div className="max-w-[700px] mx-auto">
            <img
              src={Logo}
              alt="Light Logo"
              className="w-[90%] mx-auto grayscale dark:invert dark:brightness-200"
            />
          </div> */}

          <div
            className="text-primaryDark text-center mt-10 font-rusHand font-bold
            text-xl 2xsm:text-2xl xsm:text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
            xl:text-7xl"
          >
            <span className="text-primaryBase">E-Shop | </span>

            <span
              className="before:block before:absolute before:-inset-2 mx-2 
    					before:skew-y-2 before:bg-primaryDark relative inline-block 
              sm:p-1 md:p-2 lg:p-3"
            >
              <span
                className="relative text-primaryLight dark:text-brandDarkGray 
    						font-rusHand font-bold text-xl 2xsm:text-2xl xsm:text-3xl 
                sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              >
                "Click. Buy. Enjoy!"
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative sm:mb-50">
        {/* ---------- Вариант Градиентной волны --------- */}
        {/* <Waves id={"mainPage_top_gradient"} /> */}
        {/* ---------- Вариант со сдвинутой волной --------- */}
        {/* <Waves id={"mainPage_top"} />
        <Waves id={"mainPage_top_shifted"} /> */}

        {/* ---------- Вариант с Double Wave --------- */}
        <Waves id={"mainPage_top_double"} />
      </div>
    </section>
  );
};

export default Introduction;
