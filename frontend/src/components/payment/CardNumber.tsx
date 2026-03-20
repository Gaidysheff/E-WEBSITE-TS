import AmEx from "@/assets/images/payments/american-express.svg";
import China_T_Union from "@/assets/images/payments/china_t-union.svg";
import DinersClub from "@/assets/images/payments/diners-club.svg";
import Discover from "@/assets/images/payments/discover.svg";
import Globe from "@/assets/images/payments/globe.svg";
import JCB from "@/assets/images/payments/jcb.svg";
import Maestro from "@/assets/images/payments/maestro.svg";
import Master from "@/assets/images/payments/master_card_with_fill.svg";
import Mir from "@/assets/images/payments/mir.svg";
import RuPay from "@/assets/images/payments/ru_pay.svg";
import UnionPay from "@/assets/images/payments/union_pay.svg";
import Visa from "@/assets/images/payments/visa.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useEffect, useState, type RefObject } from "react";
import { type BankCardSchemaType } from "./BankCard.tsx";

interface Props {
  values: BankCardSchemaType; // Используем тип из схемы
  onFieldChange: (field: keyof BankCardSchemaType, value: string) => void;
  inputRefs: RefObject<HTMLInputElement | null>[];
  nextRef: RefObject<HTMLInputElement | null>;
  setCardType: (type: string) => void;
}

const CardNumber = ({
  values,
  inputRefs,
  nextRef,
  onFieldChange,
  setCardType,
}: Props) => {
  const fields = ["firstSet", "secondSet", "thirdSet", "fourthSet"] as const;

  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  // Эффект смены логотипа реагирует ТОЛЬКО на изменение первых 4 цифр
  useEffect(() => {
    const firstFour = values.firstSet;

    if (!firstFour) {
      setCardType(Globe);
    } else if (firstFour.match(/^220[0-4]/)) {
      setCardType(Mir);
    } else if (firstFour.match(/^3[0689]/)) {
      setCardType(DinersClub);
    } else if (firstFour.startsWith("31")) {
      setCardType(China_T_Union);
    } else if (firstFour.startsWith("34") || firstFour.startsWith("37")) {
      setCardType(AmEx);
    } else if (firstFour.startsWith("35")) {
      setCardType(JCB);
    } else if (firstFour.startsWith("4")) {
      setCardType(Visa);
    } else if (
      firstFour.match(/^222[123456789]/) ||
      firstFour.match(/^2[34567]/) ||
      firstFour.match(/^5[12345]/)
    ) {
      setCardType(Master);
    } else if (
      firstFour.startsWith("5018") ||
      firstFour.startsWith("5020") ||
      firstFour.startsWith("5038") ||
      firstFour.startsWith("5893") ||
      firstFour.startsWith("6304") ||
      firstFour.startsWith("6759") ||
      firstFour.startsWith("6761") ||
      firstFour.startsWith("6762") ||
      firstFour.startsWith("6763")
    ) {
      setCardType(Maestro);
    } else if (firstFour.startsWith("62")) {
      setCardType(UnionPay);
    } else if (
      firstFour.startsWith("6011") ||
      firstFour.match(/^64[456789]/) ||
      firstFour.startsWith("65")
    ) {
      setCardType(Discover);
    } else if (
      firstFour.match(/^6[05]/) ||
      firstFour.match(/^8[12]/) ||
      firstFour.startsWith("508")
    ) {
      setCardType(RuPay);
    } else {
      setCardType(Globe);
    }
  }, [values.firstSet]);

  // Обработчик стандартного ввода цифр
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);

    // Вызываем переданный метод обновления
    onFieldChange(fields[index], val);

    // Если ввели 4 цифры
    if (val.length === 4) {
      if (index < 3) {
        // Переходим к следующему блоку внутри номера карты
        inputRefs[index + 1].current?.focus();
      } else {
        // Мы в 4-м блоке, переходим на Имя (внешний реф)
        nextRef.current?.focus();
      }
    }
  };

  // Обработчик клавиш (Удаление и Стрелки)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const target = e.currentTarget;

    if (e.key === "Backspace" && target.value === "" && index > 0) {
      // Если стерли инпут до конца и жмем бекспейс — прыгаем назад
      inputRefs[index - 1].current?.focus();
    } else if (
      e.key === "ArrowLeft" &&
      target.selectionStart === 0 &&
      index > 0
    ) {
      // Стрелочка влево
      e.preventDefault();
      inputRefs[index - 1].current?.focus();
    } else if (
      e.key === "ArrowRight" &&
      target.selectionStart === target.value.length &&
      index < 3
    ) {
      // Стрелочка вправо
      e.preventDefault();
      inputRefs[index + 1].current?.focus();
    }
  };

  // Обработчик вставки из буфера обмена (Paste)
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    // Только цифры

    if (!pastedData) return;

    // Разбиваем вставленную строку по 4 символа и рассылаем в стейт
    let lastFilledIndex = 0;

    fields.forEach((field, i) => {
      const chunk = pastedData.slice(i * 4, (i + 1) * 4);
      if (chunk) {
        onFieldChange(field, chunk);
        lastFilledIndex = i; // Теперь индекс обновится
      }
    });

    // Фокусируемся на последнем заполненном инпуте
    // (или следующем, если он заполнен полностью)

    const focusIndex =
      pastedData.length % 4 === 0 && lastFilledIndex < 3
        ? lastFilledIndex + 1
        : lastFilledIndex;
    inputRefs[focusIndex].current?.focus();
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="invisible h-0 w-0 absolute -top-[200vh]">
        Card Number
      </legend>
      <label
        // htmlFor="cc-1"
        className="uppercase text-[0.5rem] 2xsm:text-[0.525rem]
          xsm:text-[0.6562rem] sm:text-sm"
      >
        Card Number
      </label>
      <div
        // data-connected-inputs
        className="flex justify-between items-center text-myMainColorDarker
        text-lg"
      >
        {/* Рендерим инпуты через .map(), чтобы не дублировать код 4 раза */}
        <div className="flex gap-2 2xsm:gap-3 xsm:gap-4 sm:gap-5">
          {fields.map((field, index) => (
            <input
              key={field}
              ref={inputRefs[index]} // Привязываем реф из родителя
              type="tel"
              inputMode="numeric"
              maxLength={4}
              aria-label={`Credit Card ${index + 1} Set Of Digits`}
              required
              value={values[field]} // Берем значение из общего объекта
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              pattern="[0-9]{4}"
              className="bg-white font-mono rounded-xs p-1 w-[6ch] sm:w-[5ch]
              text-[0.5rem] 2xsm:text-[0.525rem] xsm:text-[0.66rem] sm:text-sm
              h-[1rem] 2xsm:h-[1.2rem] xsm:h-[1.65rem] sm:h-[2.2rem]
              focus:outline-white focus:outline-1 focus:outline-offset-1
              2xsm:focus:outline-2 2xsm:focus:outline-offset-2
              sm:focus:outline-3 sm:focus:outline-offset-3 text-center"
            />
          ))}
        </div>
        {/* Дополнительный инпут (CVC/Additional) */}
        <div className="flex mx-auto">
          <Tooltip
            open={isTooltipOpen} // Теперь мы сами решаем, когда его показывать
            onOpenChange={setIsTooltipOpen}
          >
            <TooltipTrigger asChild>
              <div>
                <input
                  type="tel"
                  inputMode="numeric"
                  aria-label={"Additional 3 digits"}
                  value={values.additionalSet}
                  onFocus={() => setIsTooltipOpen(true)}
                  // Открываем при клике/фокусе
                  onBlur={() => setIsTooltipOpen(false)}
                  // Закрываем при уходе
                  onMouseEnter={() => setIsTooltipOpen(true)}
                  // Оставляем hover для десктопа
                  onMouseLeave={() => setIsTooltipOpen(false)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 3);
                    onFieldChange("additionalSet", val);

                    // Если нужно, чтобы при наборе текста тултип исчезал:
                    if (val.length > 0) setIsTooltipOpen(false);
                  }}
                  pattern="[0-9]{3}"
                  className="bg-gray-400 font-mono rounded-xs p-1 w-[5ch] sm:w-[4ch]
                    text-[0.5rem] 2xsm:text-[0.525rem] xsm:text-[0.66rem] sm:text-sm
                    h-[1rem] 2xsm:h-[1.2rem] xsm:h-[1.65rem] sm:h-[2.2rem]
                    focus:outline-gray-400 focus:outline-1 focus:outline-offset-1
                    2xsm:focus:outline-2 2xsm:focus:outline-offset-2
                    sm:focus:outline-3 sm:focus:outline-offset-3 text-center"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              avoidCollisions={true}
              // boundary={document.body}
              className="text-[0.5rem] 2xsm:text-[0.7rem] xsm:text-[0.9rem]
              sm:text-[1.1rem]"
            >
              <p>If your card number has 19 digits,</p>
              <p>please, enter additional 3 digits over here.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </fieldset>
  );
};

export default CardNumber;
