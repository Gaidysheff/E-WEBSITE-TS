interface Props {
  value: string;
}

const CardVerificationCode = ({ value = "" }: Props) => {
  // Создаем массив из 16 элементов для рендера
  const placeholders = Array.from({ length: 3 }, (_, i) => i);

  // Убираем пробелы, чтобы считать чистые цифры
  const cleanValue = value.toString().replace(/\s/g, "");

  return (
    <div
      className="flex items-center justify-between gap-2 absolute 
      bottom-[6.9rem] right-[10rem]"
    >
      <p className="uppercase text-sm">CVC/CVV/CVP</p>
      <div
        className="bg-white text-myMainColorDark rounded-xs p-2
        font-[Ubuntu] w-[10ch] text-sm h-[3rem]"
      >
        <div className="relative flex gap-5 text-2xl">
          <div className="flex gap-2 mx-auto">
            {placeholders.map((i) => {
              const digit = cleanValue[i]; // Берем символ по индексу
              const hasDigit = digit !== undefined;

              return (
                <div
                  key={i}
                  className="w-2 h-9 flex items-center justify-center
                    transition-all duration-300"
                >
                  {/* Если цифра есть — показываем её, если нет — буллет */}
                  <span className="animate-in fade-in zoom-in duration-500">
                    {hasDigit ? digit : "•"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardVerificationCode;
