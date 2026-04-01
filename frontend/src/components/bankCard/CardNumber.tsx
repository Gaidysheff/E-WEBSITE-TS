interface Props {
  value: string;
}

const CardNumber = ({ value = "" }: Props) => {
  // value = "" - Гарантируем, что работаем со строкой без пробелов

  // Создаем массив из 16 элементов для рендера
  const placeholders = Array.from({ length: 16 }, (_, i) => i);

  // Убираем пробелы, чтобы считать чистые цифры
  const cleanValue = value.toString().replace(/\s/g, "");

  return (
    <div className="text-white uppercase text-sm mb-7 relative">
      {/* Bullets for numbers */}
      {/* ==================================================================== */}
      <div
        className="absolute inset-0 bg-white/50 blur-xl rounded-full
        animate-pulse"
      ></div>
      <div className="relative flex gap-5 text-lg font-[CreditCard] z-5">
        {/* 1. Группируем по 4 для визуального удобства */}
        {[0, 4, 8, 12].map((startIndex) => (
          <div key={startIndex} className="flex gap-2">
            {placeholders.slice(startIndex, startIndex + 4).map((i) => {
              const digit = cleanValue[i]; // Берем символ по индексу
              const hasDigit = digit !== undefined;

              return (
                <div
                  key={i}
                  className="w-2 h-9 flex items-center justify-center
                    transition-all duration-300"
                >
                  {/* Если цифра есть — показываем её, если нет — буллет */}
                  <span
                    className={
                      hasDigit
                        ? "animate-in fade-in zoom-in duration-300 embossed-text"
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
                  className="w-2 h-9 flex items-center justify-center
                  embossed-text"
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
