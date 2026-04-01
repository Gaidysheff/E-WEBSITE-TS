interface Props {
  value: string;
}

const HolderName = ({ value = "" }: Props) => {
  // value = "" - Гарантируем, что работаем со строкой без пробелов

  // Проверяем, нужно ли показывать "красивое" имя или заглушку
  // Показываем имя, если в нем есть символы ИЛИ если поле в фокусе
  const showLiveName = value.length > 0;

  return (
    <div className="flex flex-col min-w-[200px] gap-1">
      <div className="uppercase opacity-70 text-sm font-[Ubuntu]">
        cardholder's name
      </div>
      <div
        className="text-white uppercase h-8 flex items-center font-[CreditCard]
        text-sm mb-10"
      >
        {!showLiveName ? (
          // Статичное состояние, когда поле пустое и нет фокуса
          <span className="text-lg opacity-50 tracking-widest">
            Your Name Here
          </span>
        ) : (
          // "Живое" состояние при вводе
          <div
            className="relative flex text-xl tracking-tight overflow-hidden
            embossed-text-light"
          >
            <div className="flex gap-[2px]">
              {value.split("").map((char, i) => (
                <span
                  key={i}
                  className="animate-in fade-in slide-in-from-bottom-2
                  duration-500"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default HolderName;
