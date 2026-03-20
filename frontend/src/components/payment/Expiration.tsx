import { CURRENT_YEAR } from "@/lib/utilities.ts";
import { type BankCardSchemaType } from "./BankCard.tsx";
import { type RefObject } from "react";

interface Props {
  month: string;
  year: string;
  monthRef: RefObject<HTMLSelectElement | null>;
  yearRef: RefObject<HTMLSelectElement | null>;
  nextRef: RefObject<HTMLInputElement | null>;
  onFieldChange: (field: keyof BankCardSchemaType, value: string) => void;
}

const Expiration = ({
  month,
  year,
  monthRef,
  yearRef,
  nextRef,
  onFieldChange,
}: Props) => {
  // Создаем массив годов прямо перед рендером
  const dynamicYears = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR + i);

  // (Опционально) Можно так же сгенерировать месяцы,
  // чтобы не писать 12 тегов <option> вручную
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  return (
    <fieldset className="flex flex-col justify-between gap-1 sm:gap-2">
      <legend className="invisible h-0 w-0 absolute -top-[200vh]">
        Expiration
      </legend>
      <label
        className="uppercase text-[0.5rem] 2xsm:text-[0.525rem]
        xsm:text-[0.66rem] sm:text-sm"
      >
        Expiration
      </label>
      <div className="flex gap-1 sm:gap-2">
        <select
          aria-label="Expiration Month"
          required
          value={month}
          ref={monthRef} // Привязываем реф из родителя
          onChange={(e) => {
            onFieldChange("month", e.target.value);

            // Как только выбрали месяц — прыгаем на год
            yearRef.current?.focus();
          }}
          className="bg-white rounded-xs text-myMainColorDarker px-1 sm:p-1
          rounded-xs appearance-none text-[0.5rem]
          2xsm:text-[0.525rem] xsm:text-[0.6562rem] sm:text-sm
          h-[1rem] 2xsm:h-[1.2rem] xsm:h-[1.65rem] sm:h-[2.2rem]
          focus:outline-white focus:outline-1 focus:outline-offset-1
          2xsm:focus:outline-2 2xsm:focus:outline-offset-2
          sm:focus:outline-3 sm:focus:outline-offset-3"
        >
          {/* 2. Рендерим месяцы через map */}
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          aria-label="Expiration Year"
          required
          value={year}
          ref={yearRef}
          onChange={(e) => {
            onFieldChange("year", e.target.value);
            // Как только выбрали год — прыгаем на CVC
            nextRef.current?.focus();
          }}
          className="bg-white rounded-xs text-myMainColorDarker px-1 sm:p-1
          rounded-xs appearance-none text-[0.5rem]
          2xsm:text-[0.525rem] xsm:text-[0.6562rem] sm:text-sm
          h-[1rem] 2xsm:h-[1.2rem] xsm:h-[1.65rem] sm:h-[2.2rem]
          focus:outline-white focus:outline-1 focus:outline-offset-1
          2xsm:focus:outline-2 2xsm:focus:outline-offset-2
          sm:focus:outline-3 sm:focus:outline-offset-3"
        >
          {/* 3. Рендерим годы через map */}
          {dynamicYears.map((dynamicYear) => (
            <option key={dynamicYear} value={dynamicYear}>
              {dynamicYear}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
};

export default Expiration;
