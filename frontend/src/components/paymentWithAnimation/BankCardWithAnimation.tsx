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
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

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
    <div className="grid grid-rows-2 lg:grid-cols-2 gap-6 lg:-mb-60">
      {/* --------- Card Display --------- */}
      <CardDisplay isFlipped={isFlipped} cardType={cardType} />
      {/* --------- Card Form --------- */}
      <CardForm
        onSubmitData={onSubmitData}
        setIsFlipped={setIsFlipped}
        setCardType={setCardType}
      />
    </div>
  );
};

export default BankCardWithAnimation;
