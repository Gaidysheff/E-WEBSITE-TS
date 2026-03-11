// BankCardWithAnimation.tsx

const BankCardWithAnimation = () => {
  const [isNumberFocused, setIsNumberFocused] = useState<boolean>(false);

  return (
    <div className="grid grid-rows-2 lg:grid-cols-2 gap-6 lg:-mb-60">
      {/* --------- Card Display --------- */}
      <CardDisplay
        isFlipped={isFlipped}
        cardType={cardType}
        value={formValues.cardNumber}
        isFocused={isNumberFocused}
      />
      {/* Настоящий скрытый инпут поверх всей карты или под ней */}
      <input
        type="tel"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        maxLength={19}
        onFocus={() => setIsNumberFocused(true)}
        onBlur={() => setIsNumberFocused(false)}
        value={formValues.cardNumber}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "");
          bankCardForm.setFieldValue("cardNumber", val);
        }}
      />
      {/* --------- Card Form --------- */}
      ...
    </div>
  );
};

// =======================================================
// CardDisplay.tsx

type Props = {
...
  value: string;
  isFocused: boolean;
};

const CardDisplay = ({ ... value, isFocused }: Props) => {
  return (
    <div
      className=""
    >
      {/* --------- Front side of the card --------- */}
      <div
        className=""
      >
...
        <CardNumber value={value} isFocused={isFocused} />

...
      </div>
      {/* --------- Back side of the card --------- */}
      <div
        className=""
      >
...
      </div>
    </div>
  );
};

// =======================================================
// CardNumber.tsx

interface Props {
  value: string;
  isFocused: boolean;
}

const CardNumber = ({ value, isFocused }: Props) => {

  const placeholders = Array.from({ length: 16 }, (_, i) => i);

  const cleanValue = value.replace(/\s/g, "");

  return (
    <div
      className="text-white uppercase text-[0.5rem] 2xsm:text-[0.525rem]
          xsm:text-[0.6562rem] sm:text-sm mb-10"
    >
      {/* Bullets for numbers */}
      <div className="relative flex gap-4 font-mono text-2xl">
        {/* 1. Группируем по 4 для визуального удобства */}
        {[0, 4, 8, 12].map((startIndex) => (
          <div key={startIndex} className="flex gap-2">
            {placeholders.slice(startIndex, startIndex + 4).map((i) => {
              const digit = cleanValue[i];
              const isDigitPresent = digit !== undefined;

              return (
                <div
                  key={i}
                  className={`w-6 h-9 flex items-center justify-center border-b-2
                    transition-all duration-300 ${
                      isFocused ? "border-white" : "border-gray-500 opacity-50"
                    }`}
                >
                  {/* Если цифра есть — показываем её, если нет — буллет */}
                  <span
                    className={
                      isDigitPresent
                        ? "animate-in fade-in zoom-in duration-300"
                        : "opacity-30"
                    }
                  >
                    {isDigitPresent ? digit : "•"}
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
                  className="w-6 h-9 flex items-center justify-center border-b-2
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



const form = useForm({...})

<ComponentWithForm/>

// ComponenWithFormt

          <form.Field />
