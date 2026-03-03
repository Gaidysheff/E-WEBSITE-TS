import Globe from "@/assets/images/payments/Globe.svg";
import { useForm, useStore, type AnyFieldApi } from "@tanstack/react-form";
// import { useStore } from "@tanstack/react-form";
import { z } from "zod";
import CardLogo from "./CardLogo.tsx";
import CardNumber from "./CardNumber.tsx";
import CardVerificationCode from "./CardVerificationCode.tsx";
import Expiration from "./Expiration.tsx";
import HolderName from "./HolderName.tsx";
import Button from "@/components/uiComponents/Button";
// import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, type FormEvent, type ReactNode } from "react";
import "./style.css";
import { CURRENT_YEAR } from "@/lib/utils.ts";

interface FormProps {
  onSubmitData: (data: Record<string, string>) => void;
}

const bankCardSchema = z.object({
  userName: z
    .string()
    .min(1, { message: "Name is required" })
    // Ensures the input is a string and not empty
    .min(2, { message: "Name must be at least 2 characters" })
    // Ensures minimum length
    .regex(/^[a-zA-Z\s]+$/, "String must contain only letters (a-z, A-Z)"),
  // Ensures Latin letters
  cvc: z
    .string()
    .regex(/^\d+$/, { message: "cvc must contain only digits" })
    .max(3, { message: "cvc must be not more that 3 digits" }),
  month: z.string(),
  year: z.string(),
  firstSet: z.string(),
  secondSet: z.string(),
  thirdSet: z.string(),
  fourthSet: z.string(),
  additionalSet: z.string(),
});

// Optional: Infer the TypeScript type from the schema for full type safety
export type BankCardSchemaType = z.infer<typeof bankCardSchema>;

function getFieldError(field: AnyFieldApi): ReactNode {
  const errors = field.state.meta.errors;

  if (errors.length === 0 || !field.state.meta.isTouched) return null;

  // Безопасно достаем текст ошибки
  return (
    <ul className="">
      {errors.map((err, index) => (
        <li key={index}>
          {typeof err === "string" ? err : err?.message || ""}
        </li>
      ))}
    </ul>
  );
}

const BankCardWithAnimation = ({ onSubmitData }: FormProps) => {
  // const navigate = useNavigate();

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
      onChangeAsync: bankCardSchema,
      onChangeAsyncDebounceMs: 500,
    },

    onSubmit: async ({ value }) => {
      // Do something with data
      console.log("🚀 ~ BankCard ~ value:", value);
      alert(JSON.stringify(value, null, 2));
      // navigate({ to: `/` });
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
  const [isFlipped, setIsFlipped] = useState<boolean>(true);

  const [cardType, setCardType] = useState<string>(Globe);

  const updateField = (field: keyof BankCardSchemaType, value: string) => {
    bankCardForm.setFieldValue(field, value);
    bankCardForm.setFieldMeta(field, (prev) => ({ ...prev, isTouched: true }));
  };

  // const canSubmit = useStore(bankCardForm.store, (state) => state.canSubmit);
  // const isDirty = useStore(bankCardForm.store, (state) => state.isDirty);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    // Передаём собранный набор данных в верхний компонент
    const currentValues = bankCardForm.state.values;
    onSubmitData(currentValues);
    bankCardForm.handleSubmit();
  };

  // Если все же нужна кастомная проверка всех полей кроме одного:
  const isAllFilled = useStore(bankCardForm.store, (state) => {
    const { additionalSet, ...rest } = state.values;
    return Object.values(rest).every(Boolean);
  });

  return (
    <div>
      <form className="text-white relative" onSubmit={submitHandler}>
        <div className={`card-container ${isFlipped ? "is-flipped" : ""}`}>
          {/* --------- Front side of the card --------- */}
          <div className="card-front">
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
                inputRefs={[
                  firstSetRef,
                  secondSetRef,
                  thirdSetRef,
                  fourthSetRef,
                ]}
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
          </div>
          {/* --------- Back side of the card --------- */}
          <div className="card-back">
            <div
              className="bg-myMainColorDark border-2 border-myMainColorDarker
              rounded-2xl p-8 absolute
              w-[13rem] 2xsm:w-[15.6rem] xsm:w-[19.5rem] sm:w-[26rem] 
              h-[8.25rem] 2xsm:h-[9.9rem] xsm:h-[12.375rem] sm:h-[16.5rem]"
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
                    setIsFlipped={setIsFlipped}
                    error={getFieldError(field)} // Передаем ошибку вниз
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="w-[15rem] 2xsm:w-[18rem] xsm:w-[22.5rem] sm:w-[30rem]">
          <Button
            disabled={!isAllFilled}
            handleClick={submitHandler}
            className="checkout-btn"
          >
            Pay
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BankCardWithAnimation;
