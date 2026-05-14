import React, { createContext, useContext, useEffect, useState } from "react";

interface ColorContextType {
  hue: number;
  lightness: number;
  chroma: number;
  isContrast: boolean; // Новый стейт
  setHue: (h: number) => void;
  setLightness: (l: number) => void;
  setChroma: (c: number) => void;
  setIsContrast: (v: boolean) => void; // Функция переключения режима
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [hue, setHueState] = useState(
    () => Number(localStorage.getItem("card-hue")) || 25,
  );

  const [lightness, setLightnessState] = useState(
    () => Number(localStorage.getItem("card-lightness")) || 62,
  );

  const [chroma, setChromaState] = useState(
    () => Number(localStorage.getItem("card-chroma")) || 25,
  );

  // Инициализируем режим контраста из localStorage
  const [isContrast, setIsContrastState] = useState(
    () => localStorage.getItem("is-contrast") === "true",
  );

  const [isDark, setIsDark] = useState(false);
  // 1. Создаем стейт для темы, инициализируем из localStorage
  // const [isDark, setIsDark] = useState(
  //   () => localStorage.getItem("theme") === "dark",
  // );

  // Функции-обертки, которые сразу пишут в localStorage
  const setHue = (h: number) => {
    setHueState(h);
    localStorage.setItem("card-hue", String(h));
  };
  const setLightness = (l: number) => {
    setLightnessState(l);
    localStorage.setItem("card-lightness", String(l));
  };
  const setChroma = (c: number) => {
    setChromaState(c);
    localStorage.setItem("card-chroma", String(c));
  };

  const setIsContrast = (v: boolean) => {
    setIsContrastState(v);
    localStorage.setItem("is-contrast", String(v));
  };

  // 2. Слушаем изменения класса на теге <html> силами браузера
  useEffect(() => {
    const root = document.documentElement;

    // Создаем наблюдатель за изменениями атрибутов (в частности, класса "dark")
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    // Принудительно проверяем один раз при монтировании
    setIsDark(root.classList.contains("dark"));

    return () => observer.disconnect(); // Чистим за собой при удалении компонента
  }, []);

  // МАГИЯ: Один useEffect на всё приложение
  useEffect(() => {
    const root = document.documentElement; // Добираемся до тега <html>

    // Вычисляем палитру тонов
    const mainColor = `oklch(${lightness}% ${chroma / 100} ${hue})`;
    // Базовые расчеты тонов
    const baseLighter = `oklch(${Math.min(lightness * 1.3, 100)}% ${chroma / 150} ${hue})`;
    const baseLight = `oklch(${Math.min(lightness * 1.15, 100)}% ${chroma / 120} ${hue})`;
    const baseDark = `oklch(${lightness * 0.8}% ${chroma / 110} ${hue})`;
    const baseDarker = `oklch(${lightness * 0.6}% ${chroma / 130} ${hue})`;

    // 2. Расчет вторичного тона (Secondary Hue) по формуле
    const secondaryHue = hue < 180 ? hue + 180 : hue - 180;
    // 3. Формируем вторичный цвет в зависимости от режима
    // Если контраст выключен, secondaryColor становится точной копией mainColor
    const secColor = isContrast
      ? `oklch(${lightness}% ${chroma / 100} ${secondaryHue})`
      : mainColor;

    // ТРЮК: Если тема темная, меняем переменные местами на самом верхнем уровне!
    const lighter = isDark ? baseDarker : baseLighter;
    const light = isDark ? baseDark : baseLight;
    const dark = isDark ? baseLight : baseDark;
    const darker = isDark ? baseLighter : baseDarker;

    // Расчет оттенков для вторичного цвета (нужны для адаптации под темную тему)
    const secLight = isDark
      ? `oklch(${lightness * 0.8}% ${chroma / 110} ${secondaryHue})`
      : `oklch(${Math.min(lightness * 1.15, 100)}% ${chroma / 120} ${secondaryHue})`;

    const secDark = isDark
      ? `oklch(${Math.min(lightness * 1.15, 100)}% ${chroma / 120} ${secondaryHue})`
      : `oklch(${lightness * 0.8}% ${chroma / 110} ${secondaryHue})`;

    // # Принудительно инжектируем переменные в корень DOM-дерева
    root.style.setProperty("--myMainColor", mainColor);
    // Инжектируем уже инвертированные под тему значения
    root.style.setProperty("--myMainColorLighter", lighter);
    root.style.setProperty("--myMainColorLight", light);
    root.style.setProperty("--myMainColorDark", dark);
    root.style.setProperty("--myMainColorDarker", darker);

    // Вторичный цвет и его производные
    root.style.setProperty("--secondaryColor", secColor);
    root.style.setProperty(
      "--secondaryColorLight",
      isContrast ? secLight : light,
    );
    root.style.setProperty("--secondaryColorDark", isContrast ? secDark : dark);
  }, [hue, lightness, chroma, isDark, isContrast]); // Добавили isContrast в зависимости

  return (
    <ColorContext.Provider
      value={{
        hue,
        lightness,
        chroma,
        isContrast,
        setHue,
        setLightness,
        setChroma,
        setIsContrast,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) throw new Error("useColor must be used within ColorProvider");
  return context;
};
