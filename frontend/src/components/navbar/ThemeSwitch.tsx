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
						group-hover/button:border-primaryDark transition duration-500
						group-hover/button:scale-110 cursor-pointer
            group-hover:text-primaryDark/50"
          >
            <Sun
              className="group-hover/button:stroke-primaryBase transition
							duration-500 group-hover/button:scale-110 hover:text-primaryDark/50"
              size={30}
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
						group-hover/button:border-primaryDark transition duration-500
						group-hover/button:scale-110 cursor-pointer
            group-hover:text-primaryDark/50"
          >
            <Moon
              className="group-hover/button:stroke-primaryBase transition
							duration-500 group-hover/button:scale-110 hover:text-primaryDark/50"
              size={30}
            />
          </div>
        </button>
      );

    default:
      return null;
  }
};

export default ThemeSwitch;
