import Globe from "@/assets/images/payments/Globe.svg";
import { useForm, useStore, type AnyFieldApi } from "@tanstack/react-form";
// import { useStore } from "@tanstack/react-form";
import { z } from "zod";

// import Button from "@/components/uiComponents/Button";
// import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, type FormEvent, type ReactNode } from "react";
import "./style.css";
import { CURRENT_YEAR } from "@/lib/utils.ts";
import CardForm from "./CardForm.tsx";
import CardDisplay from "./CardDisplay.tsx";

interface FormProps {
  onSubmitData: (data: Record<string, string>) => Promise<any>;
}

const bankCardSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d+$/, { message: "number must contain only digits" })
    .refine((val) => val.length === 16 || val.length === 19, {
      message: "Must be 16 or 19 digits ",
    }),
  userName: z
    .string()
    .min(1, { message: "Name is required" })
    // Ensures the input is a string and not empty
    .min(2, { message: "Name must be at least 2 characters" })
    // Ensures minimum length
    .regex(/^[a-zA-Z\s]+$/, "String must contain only letters (a-z, A-Z)"),
  // Ensures Latin letters
  month: z.string().min(1),
  year: z.string().min(4),
  cvc: z
    .string()
    .regex(/^\d+$/, { message: "cvc must contain only digits" })
    .length(3, "CVC must be 3 digits"), // Ровно 3
});

// Optional: Infer the TypeScript type from the schema for full type safety
export type BankCardSchemaType = z.infer<typeof bankCardSchema>;

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={
            field.state.meta.errors.length ? "text-destructive text-sm" : ""
          }
        >
          {field.state.meta.errors.map((err) => err.message)[0]}
          {/* {field.state.meta.errors.map((err) => err.message).join(",")} */}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

// function getFieldError(field: AnyFieldApi): ReactNode {
//   const errors = field.state.meta.errors;

//   if (errors.length === 0 || !field.state.meta.isTouched) return null;

//   // Безопасно достаем текст ошибки
//   return (
//     <ul className="">
//       {errors.map((err, index) => (
//         <li key={index}>
//           {typeof err === "string" ? err : err?.message || ""}
//         </li>
//       ))}
//     </ul>
//   );
// }

const BankCardWithAnimation = ({ onSubmitData }: FormProps) => {
  // const navigate = useNavigate();
  const bankCardForm = useForm({
    defaultValues: {
      cardNumber: "",
      userName: "",
      cvc: "",
      month: "1",
      year: String(CURRENT_YEAR),
    } as BankCardSchemaType,

    validators: {
      // onChange: bankCardSchema,
      onChangeAsync: bankCardSchema,
      onChangeAsyncDebounceMs: 500,
    },

    onSubmit: async ({ value }) => {
      // Do something with data
      console.log("🚀 ~ BankCard ~ value:", value);
      // alert(JSON.stringify(value, null, 2));
      // navigate({ to: `/` });
    },
  });

  // Подписываемся на значения через useStore (Вариант-1)
  const formValues = useStore(bankCardForm.store, (state) => state.values);

  // Подписываемся на "живое" значение номера карты (Вариант-2)
  // const cardNumber = useStore(
  //   bankCardForm.store,
  //   (state) => state.values.cardNumber,
  // );

  // Стейт для анимации переворота
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const [cardType, setCardType] = useState<string>(Globe);

  const [isNumberFocused, setIsNumberFocused] = useState<boolean>(false);
  const [isUserNameFocused, setIsUserNameFocused] = useState<boolean>(false);

  const updateField = (field: keyof BankCardSchemaType, value: string) => {
    // 1. Обновляем значение.
    bankCardForm.setFieldValue(field, value);
    // 2. Явно помечаем поле как "тронутое" и вызываем валидацию всей формы
    bankCardForm.setFieldMeta(field, (prev) => ({ ...prev, isTouched: true }));
    // 3. ПРИНУДИТЕЛЬНЫЙ ВЫЗОВ ВАЛИДАЦИИ (Секрет мгновенной активации кнопки)
    // Это заставит canSubmit обновиться сразу после ввода последней цифры
    bankCardForm.validate("change");
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    bankCardForm.handleSubmit();
  };

  return (
    <div className="grid grid-rows-2 lg:grid-cols-2 gap-6 lg:-mb-60">
      {/* --------- Card Display --------- */}
      <CardDisplay
        isFlipped={isFlipped}
        cardType={cardType}
        formValues={formValues}
        isNumberFocused={isNumberFocused}
        isUserNameFocused={isUserNameFocused}
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
          updateField("cardNumber", val);
          // bankCardForm.setFieldValue("cardNumber", value);
          // это тот же update
        }}
      />
      <input
        type="tel"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        maxLength={30}
        onFocus={() => setIsUserNameFocused(true)}
        onBlur={() => setIsUserNameFocused(false)}
        value={formValues.userName}
        onChange={(e) => {
          const val = e.target.value;
          updateField("userName", val);
        }}
      />
      {/* --------- Card Form --------- */}
      <CardForm
        bankCardForm={bankCardForm}
        onSubmitData={onSubmitData}
        setIsFlipped={setIsFlipped}
        setCardType={setCardType}
        onFieldChange={updateField}
      />
    </div>
  );
};

export default BankCardWithAnimation;
