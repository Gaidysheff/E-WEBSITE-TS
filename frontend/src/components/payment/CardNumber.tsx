import React, { useEffect, useRef } from "react";

import AmEx from "@/assets/images/payments/american-express.svg";
import China_T_Union from "@/assets/images/payments/China_T-union.svg";
import DinersClub from "@/assets/images/payments/diners-club.svg";
import Discover from "@/assets/images/payments/Discover.svg";
import Globe from "@/assets/images/payments/Globe.svg";
import JCB from "@/assets/images/payments/JCB.svg";
import Maestro from "@/assets/images/payments/Maestro.svg";
import Master from "@/assets/images/payments/MasterCardWithFill.svg";
import Mir from "@/assets/images/payments/mir.svg";
import RuPay from "@/assets/images/payments/RuPay.svg";
import UnionPay from "@/assets/images/payments/UnionPay.svg";
import Visa from "@/assets/images/payments/Visa.svg";

interface Props {
  numberSets: {
    firstSet: string;
    secondSet: string;
    thirdSet: string;
    fourthSet: string;
  };
  getNumberSet: (field: string, value: string) => void;

  setCardType: (type: string) => void;
}

const CardNumber = ({ numberSets, getNumberSet, setCardType }: Props) => {
  // Создаем ссылки для управления фокусом
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Массив для удобного рендеринга и управления
  const fields: string[] = ["firstSet", "secondSet", "thirdSet", "fourthSet"];

  const values = [
    numberSets.firstSet,
    numberSets.secondSet,
    numberSets.thirdSet,
    numberSets.fourthSet,
  ];

  // Эффект смены логотипа реагирует ТОЛЬКО на изменение первых 4 цифр
  useEffect(() => {
    const firstFour = numberSets.firstSet;

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
  }, [numberSets]);

  // Обработчик стандартного ввода цифр
  const handleChange = (e: React.ChangeEvent, index: number) => {
    // Разрешаем только цифры
    const value = (e.target as HTMLInputElement).value.replace(/\D/g, "");
    if (value.length > 4) return; // Страховка от ввода >4 символов
    getNumberSet(fields[index], value);
    // Автоматический переход на следующий инпут при вводе 4 цифр
    if (value.length === 4 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Обработчик клавиш (Удаление и Стрелки)
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const target = e.currentTarget as HTMLInputElement;

    if (e.key === "Backspace" && target.value === "" && index > 0) {
      // Если стерли инпут до конца и жмем бекспейс — прыгаем назад
      inputRefs.current[index - 1]?.focus();
    } else if (
      e.key === "ArrowLeft" &&
      target.selectionStart === 0 &&
      index > 0
    ) {
      // Стрелочка влево
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (
      e.key === "ArrowRight" &&
      target.selectionStart === target.value.length &&
      index < 3
    ) {
      // Стрелочка вправо
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
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
    for (let i = 0; i < 4; i++) {
      const chunk = pastedData.slice(i * 4, (i + 1) * 4);
      if (chunk) {
        getNumberSet(fields[i], chunk);
        lastFilledIndex = i;
      }
    }
    // Фокусируемся на последнем заполненном инпуте
    // (или следующем, если он заполнен полностью)
    const focusIndex =
      pastedData.length % 4 === 0 && lastFilledIndex < 3
        ? lastFilledIndex + 1
        : lastFilledIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="invisible h-0 w-0 absolute -top-[200vh]">
        Card Number
      </legend>
      <label
        htmlFor="cc-1"
        className="uppercase text-[0.5rem] 2xsm:text-[0.525rem]
          xsm:text-[0.6562rem] sm:text-sm"
      >
        Card Number
      </label>
      <div
        data-connected-inputs
        className="flex gap-5 text-myMainColorDarker text-lg"
      >
        {/* Рендерим инпуты через .map(), чтобы не дублировать код 4 раза */}
        {fields.map((field, index) => (
          <input
            key={field}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="tel"
            inputMode="numeric"
            maxLength={4}
            aria-label={`Credit Card ${index + 1} Set Of Digits`}
            required
            value={values[index]}
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
    </fieldset>
  );
};

export default CardNumber;
