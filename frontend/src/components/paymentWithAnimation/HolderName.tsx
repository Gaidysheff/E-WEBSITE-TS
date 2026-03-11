interface Props {
  value: string;
  isFocused: boolean;
}

const HolderName = ({ value = "", isFocused }: Props) => {
  // value = "" - Гарантируем, что работаем со строкой без пробелов

  console.log("🚀 ~ HolderName ~ isFocused:", isFocused);
  console.log("🚀 ~ HolderName ~ value:", value);

  // Создаем массив из 16 элементов для рендера
  const placeholders = Array.from({ length: 30 }, (_, i) => i);

  return (
    <>
      <div
        className="uppercase text-[0.5rem] 2xsm:text-[0.525rem]
                xsm:text-[0.66rem] sm:text-sm"
      >
        cardholder's name
        {/* Эта надпись будет удаляться при вводе имени */}
      </div>
      <div
        className="text-white uppercase text-[0.5rem] 2xsm:text-[0.525rem]
          xsm:text-[0.6562rem] sm:text-sm mb-10"
      >
        {/* ==================================================================== */}
        <div className="relative flex gap-5 text-2xl">
          <div className="flex gap-2">
            {placeholders.map((i) => {
              const letter = value[i]; // Берем символ по индексу
              const hasLetter = letter !== undefined;

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
                      hasLetter
                        ? "animate-in fade-in zoom-in duration-300"
                        : "opacity-30"
                    }
                  >
                    {hasLetter ? letter : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default HolderName;
