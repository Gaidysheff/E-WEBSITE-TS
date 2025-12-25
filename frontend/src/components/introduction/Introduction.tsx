import LogoSwitch from "./LogoSwitch";
import { useTheme } from "@/store/ThemeContext";

const Introduction = () => {
  const { theme } = useTheme();
  return (
    <section className="my-20 flex flex-col">
      {theme === "light" ? <LogoSwitch id="dark" /> : <LogoSwitch id="light" />}

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
    </section>
  );
};

export default Introduction;
