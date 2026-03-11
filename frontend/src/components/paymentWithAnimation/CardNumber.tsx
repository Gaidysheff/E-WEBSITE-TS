import React, { useEffect, useRef, type RefObject } from "react";

interface Props {
  value: string;
  isFocused: boolean;
}

const CardNumber = ({ value = "", isFocused }: Props) => {
  // value = "" - Гарантируем, что работаем со строкой без пробелов

  // Создаем массив из 16 элементов для рендера
  const placeholders = Array.from({ length: 16 }, (_, i) => i);

  // Убираем пробелы, чтобы считать чистые цифры
  const cleanValue = value.toString().replace(/\s/g, "");

  return (
    <div
      className="text-white uppercase text-[0.5rem] 2xsm:text-[0.525rem]
          xsm:text-[0.6562rem] sm:text-sm mb-10"
    >
      {/* Bullets for numbers */}
      {/* ==================================================================== */}
      <div className="relative flex gap-5 font-mono text-2xl">
        {/* 1. Группируем по 4 для визуального удобства */}
        {[0, 4, 8, 12].map((startIndex) => (
          <div key={startIndex} className="flex gap-2">
            {placeholders.slice(startIndex, startIndex + 4).map((i) => {
              const digit = cleanValue[i]; // Берем символ по индексу
              const hasDigit = digit !== undefined;

              return (
                <div
                  key={i}
                  className={`w-2 h-9 flex items-center justify-center border-b-2
                    transition-all duration-300 ${
                      isFocused ? "border-white" : "border-gray-500 opacity-50"
                    }`}
                >
                  {/* Если цифра есть — показываем её, если нет — буллет */}
                  <span
                    className={
                      hasDigit
                        ? "animate-in fade-in zoom-in duration-300"
                        : "opacity-30"
                    }
                  >
                    {hasDigit ? digit : "•"}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        {/* 2. Дополнительные 3 цифры (если есть) */}
        {cleanValue.length > 16 && (
          <div className="ml-2 flex gap-2 animate-in slide-in-from-left-2">
            {cleanValue
              .slice(16, 19)
              .split("")
              .map((digit: any, i: number) => (
                <div
                  key={i}
                  className="w-2 h-9 flex items-center justify-center border-b-2
                  border-orange-400 text-orange-400"
                >
                  {digit}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardNumber;
