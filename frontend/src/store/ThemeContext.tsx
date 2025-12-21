import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeMode = string | null;

type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeMode>(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Access to html element
  const element = document.documentElement;
  // set theme to localStorage and html-element
  useEffect(() => {
    if (theme === null) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        element.classList.add("dark");
      } else {
        element.classList.remove("dark");
      }
    }
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
