import Globe from "@/assets/images/payment/Globe.svg";
import { useForm, useStore, type AnyFieldApi } from "@tanstack/react-form";
import Button from "@/components/uiComponents/Button";
import { z } from "zod";
import CardLogo from "./CardLogo.tsx";
import CardNumber from "./CardNumber.tsx";
import CardVerificationCode from "./CardVerificationCode.tsx";
import Expiration from "./Expiration.tsx";
import HolderName from "./HolderName.tsx";
import { Spinner } from "@/components/ui/spinner";
import { CURRENT_YEAR } from "@/lib/utilities.ts";
import { useRef, useState, type FormEvent, type ReactNode } from "react";

interface FormProps {
  onSubmitData: (data: Record<string, string>) => Promise<any>;
}

const bankCardSchema = z.object({
  userName: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .regex(/^[a-zA-Z\s]+$/, "Only latin letters"),
  cvc: z
    .string()
    .regex(/^\d+$/, { message: "cvc must contain only digits" })
    .length(3, "CVC must be 3 digits"), // Ровно 3
  month: z.string().min(1),
  year: z.string().min(4),
  // Для каждого блока карты требуем ровно 4 цифры
  firstSet: z.string().min(1).length(4, "4 digits required"),
  secondSet: z.string().min(1).length(4, "4 digits required"),
  thirdSet: z.string().min(1).length(4, "4 digits required"),
  fourthSet: z.string().min(1).length(4, "4 digits required"),
  additionalSet: z
    .string()
    .refine((val) => val.length === 0 || val.length === 3, {
      message: "Must be 3 digits if used",
    }), // А это поле может быть пустым (для 16 цифр) или иметь 3 цифры (для 19)
});

// Optional: Infer the TypeScript type from the schema for full type safety
export type BankCardSchemaType = z.infer<typeof bankCardSchema>;

function getFieldError(field: AnyFieldApi): ReactNode {
  const errors = field.state.meta.errors;

  if (errors.length === 0 || !field.state.meta.isTouched) return null;

  // Безопасно достаем текст ошибки
  return (
    <ul
      className="text-[0.5rem] 2xsm:text-[0.7rem] xsm:text-[0.9rem]
      sm:text-[1.1rem]"
    >
      {errors.map((err, index) => (
        <li key={index}>
          {typeof err === "string" ? err : err?.message || ""}
        </li>
      ))}
    </ul>
  );
}

const BankCard = ({ onSubmitData }: FormProps) => {
  const bankCardForm = useForm({
    defaultValues: {
      userName: "",
      cvc: "",
      month: "1",
      year: String(CURRENT_YEAR),
      firstSet: "",
      secondSet: "",
      thirdSet: "",
      fourthSet: "",
      additionalSet: "",
    },

    validators: {
      onChange: bankCardSchema,
      // onChangeAsync: bankCardSchema,
      // onChangeAsyncDebounceMs: 500,

      // ВАЖНО: валидируем схему при монтировании компонента
      onMount: bankCardSchema,
    },

    onSubmit: async ({ value }) => {
      // 1. TanStack Form сам поставит isSubmitting в true
      // Кнопка переключится в "Processing...", пока этот await не завершится
      try {
        await onSubmitData(value);
      } catch (err) {
        console.error("Payment failed", err);
        // Ошибка здесь вернет кнопку в обычное состояние
      }
      // 2. После завершения async функции isSubmitting вернется в false
    },
  });

  // Подписываемся на значения через useStore
  const formValues = useStore(bankCardForm.store, (state) => state.values);

  // Создаем "пульты управления" для каждого смыслового блока
  const firstSetRef = useRef<HTMLInputElement>(null);
  const secondSetRef = useRef<HTMLInputElement>(null);
  const thirdSetRef = useRef<HTMLInputElement>(null);
  const fourthSetRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLSelectElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);
  const cvcRef = useRef<HTMLInputElement>(null);

  // Стейт для анимации переворота

  const [cardType, setCardType] = useState<string>(Globe);

  const updateField = (field: keyof BankCardSchemaType, value: string) => {
    // 1. Обновляем значение.
    bankCardForm.setFieldValue(field, value);
    // 2. Явно помечаем поле как "тронутое" и вызываем валидацию всей формы
    bankCardForm.setFieldMeta(field, (prev) => ({ ...prev, isTouched: true }));
    // 3. ПРИНУДИТЕЛЬНЫЙ ВЫЗОВ ВАЛИДАЦИИ (Секрет мгновенной активации кнопки)
    // Это заставит canSubmit обновиться сразу после ввода последней цифры
    bankCardForm.validate("change");
  };

  // Подписываемся на встроенные переменные через useStore
  const isSubmitting = useStore(bankCardForm.store, (s) => s.isSubmitting);
  const canSubmit = useStore(bankCardForm.store, (state) => state.canSubmit);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    bankCardForm.handleSubmit();
  };

  // Если все же нужна кастомная проверка всех полей кроме одного:
  // const isAllFilled = useStore(bankCardForm.store, (state) => {
  //   const { additionalSet, ...rest } = state.values;
  //   return Object.values(rest).every(Boolean);
  // });

  return (
    <div>
      <form
        className="text-white relative"
        onSubmit={submitHandler}
        autoComplete="off"
      >
        {/* --------- Front side of the card --------- */}
        <div
          className="bg-myMainColorDark border-2 border-myMainColorDarker
          rounded-2xl p-4 xsm:p-6 sm:p-8 mb-20
          w-[13rem] 2xsm:w-[15.6rem] xsm:w-[19.5rem] sm:w-[26rem] 
          h-[8.25rem] 2xsm:h-[9.9rem] xsm:h-[12.375rem] sm:h-[16.5rem]
          flex flex-col gap-1 sm:gap-2 z-1 overflow-hidden relative
          before:content-[''] before:absolute before:h-[600px] before:w-[600px]
          before:rounded-[100%] before:bg-myMainColorLighter/50 before:-z-1
          before:-top-[380px] before:-left-[250px]
          after:content-[''] after:absolute after:h-[700px] after:w-[700px]
          after:rounded-[100%] after:bg-myMainColorLight/50 after:-z-1
          after:-bottom-[520px] after:-left-[200px]"
        >
          <CardLogo cardType={cardType} />

          <CardNumber
            // Передаем массив рефов для внутренней навигации (1-4 блоки)
            inputRefs={[firstSetRef, secondSetRef, thirdSetRef, fourthSetRef]}
            // Ссылка на следующий элемент ПОСЛЕ номера карты
            nextRef={userNameRef}
            setCardType={setCardType}
            // Передаем "живые" значения из стора
            values={formValues}
            // Передаем метод обновления напрямую
            onFieldChange={updateField}
          />

          <div className="flex justify-between gap-2">
            <bankCardForm.Field
              name="userName"
              children={(field) => (
                <HolderName
                  inputRef={userNameRef} // Передаем реф конкретно этому полю
                  nextRef={monthRef} // После имени идем на месяц
                  userName={formValues.userName}
                  onFieldChange={updateField}
                  error={getFieldError(field)} // Передаем ошибку вниз
                />
              )}
            />

            <Expiration
              monthRef={monthRef}
              yearRef={yearRef}
              nextRef={cvcRef} // После года идем на CVC (на оборот)
              month={formValues.month}
              year={formValues.year}
              // Передаем метод обновления напрямую
              onFieldChange={updateField}
            />
          </div>
        </div>
        {/* --------- Back side of the card --------- */}
        <div
          className="bg-myMainColorDark border-2 border-myMainColorDarker
          rounded-2xl p-8 absolute
          w-[13rem] 2xsm:w-[15.6rem] xsm:w-[19.5rem] sm:w-[26rem] 
          h-[8.25rem] 2xsm:h-[9.9rem] xsm:h-[12.375rem] sm:h-[16.5rem]
          top-[1rem] 2xsm:top-[1.2rem] xsm:top-[1.5rem] sm:top-[2rem]
          left-[2rem] 2xsm:left-[2.4rem] xsm:left-[3rem] sm:left-[4rem]"
        >
          <div
            className="bg-black absolute left-0 right-0 top-[1.5rem]
            h-[1.875rem] 2xsm:h-[2.25rem] xsm:h-[2.8125rem] sm:h-[3.75rem]"
          ></div>

          <bankCardForm.Field
            name="cvc"
            children={(field) => (
              <CardVerificationCode
                inputRef={cvcRef}
                cvc={formValues.cvc}
                onFieldChange={updateField}
                error={getFieldError(field)} // Передаем ошибку вниз
              />
            )}
          />
        </div>
        <div
          className="w-[15rem] 2xsm:w-[18rem] xsm:w-[22.5rem] sm:w-[30rem]
        -mr-[2rem] 2xsm:-mr-[2.4rem] xsm:-mr-[3rem] sm:-mr-[4rem]"
        >
          <Button
            disabled={!canSubmit || isSubmitting}
            //  Важно: isSubmitting приоритетнее, чем проверка на заполненность
            // disabled={isButtonDisabled || isSubmitting}
            handleClick={submitHandler}
            className="checkout-btn"
          >
            {isSubmitting ? (
              <div className="flex justify-center">
                <p className="mr-5">Processing...</p>
                <Spinner className="size-5 text-red-500" />
              </div>
            ) : !canSubmit ? (
              "Fill in the card details to Pay"
            ) : (
              "Pay $100.00"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BankCard;
