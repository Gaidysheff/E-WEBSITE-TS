import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/store/ThemeContext";

type Props = {
  id: string;
};

const ThemeSwitch = ({ id }: Props) => {
  const { toggleTheme } = useTheme();

  switch (id) {
    case "light-btn":
      return (
        <button
          type="button"
          className="group/button"
          onClick={() => {
            toggleTheme();
            document.documentElement.classList.toggle("dark");
          }}
        >
          <div
            className="p-1 ml-3 border-2 border-primaryDark rounded-md
						group-hover/button:border-primaryBase transition duration-500
						group-hover/button:scale-110 cursor-pointer"
          >
            <Sun
              className="group-hover/button:stroke-primaryBase transition
							duration-500 group-hover/button:scale-110"
            />
          </div>
        </button>
      );
    case "dark-btn":
      return (
        <button
          type="button"
          className="group/button"
          onClick={() => {
            toggleTheme();
            document.documentElement.classList.toggle("light");
          }}
        >
          <div
            className="p-1 ml-3 border-2 border-primaryDark rounded-md
						group-hover/button:border-primaryBase transition duration-500
						group-hover/button:scale-110 cursor-pointer"
          >
            <Moon
              className="group-hover/button:stroke-primaryBase transition
							duration-500 group-hover/button:scale-110"
            />
          </div>
        </button>
      );

    default:
      return null;
  }
};

export default ThemeSwitch;
