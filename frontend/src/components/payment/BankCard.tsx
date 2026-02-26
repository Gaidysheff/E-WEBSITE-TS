import Globe from "@/assets/images/payments/Globe.svg";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { z } from "zod";
import CardLogo from "./CardLogo.tsx";
import CardNumber from "./CardNumber.tsx";
import CardVerificationCode from "./CardVerificationCode.tsx";
import Expiration from "./Expiration.tsx";
import HolderName from "./HolderName.tsx";
import Button from "@/components/uiComponents/Button";
// import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";

interface FormProps {
  onSubmitData: (data: Record<string, string>) => void;
}

const bankCardSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    // Ensures the input is a string and not empty
    .min(2, { message: "Name must be at least 2 characters" })
    // Ensures minimum length
    .regex(/^[a-zA-Z]+$/, "String must contain only letters (a-z, A-Z)"),
  // Ensures Latin letters
  cvc: z
    .string()
    .regex(/^\d+$/, { message: "cvc must contain only digits" })
    .max(3, { message: "cvc must be not more that 3 digits" }),
});

// Optional: Infer the TypeScript type from the schema for full type safety
type BankCardSchemaType = z.infer<typeof bankCardSchema>;

function getFieldError(field: AnyFieldApi): ReactNode {
  const errors = field.state.meta.errors;

  if (errors.length === 0 || !field.state.meta.isTouched) return null;
  // Безопасно достаем текст ошибки

  // return (
  //   errors
  //     .map((err) => (typeof err === "string" ? err : err?.message || ""))
  //     // .join("\n");
  //     .join(", ")
  // );

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

const BankCard = ({ onSubmitData }: FormProps) => {
  // const navigate = useNavigate();

  const bankCardForm = useForm({
    defaultValues: {
      name: "",
      cvc: "",
    } as BankCardSchemaType,

    validators: {
      // onChange: bankCardSchema,
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

  const [cardType, setCardType] = useState(Globe);

  const currentYear = String(new Date().getFullYear());

  // Собираем все значения в единый объект
  const [formData, setFormData] = useState({
    userName: "",
    cvc: "",
    month: "1",
    year: currentYear,
    firstSet: "",
    secondSet: "",
    thirdSet: "",
    fourthSet: "",
  });

  // Универсальная функция для обновления любого поля
  const fieldChangeHandler = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    // Передаём собранный набор данных в верхний компонент
    onSubmitData(formData);
    bankCardForm.handleSubmit();
  };

  const isAllFilled = Object.values(formData).every(Boolean);

  return (
    <div>
      <form className="text-white relative" onSubmit={submitHandler}>
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
            numberSets={formData}
            getNumberSet={fieldChangeHandler}
            setCardType={setCardType}
          />

          <div className="flex justify-between gap-2">
            <bankCardForm.Field
              name="name"
              children={(field) => (
                <HolderName
                  userName={formData.userName}
                  // userName={formData.userName}
                  getName={(value) => {
                    fieldChangeHandler("userName", value); // Обновляет поле ввода
                    field.handleChange(value); // ТРИГГЕР ВАЛИДАЦИИ ФОРМЫ!
                  }}
                  error={getFieldError(field)} // Передаем ошибку вниз
                />
              )}
            />

            <Expiration
              month={formData.month}
              year={formData.year}
              getMonth={(value) => fieldChangeHandler("month", value)}
              getYear={(value) => fieldChangeHandler("year", value)}
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
                cvc={formData.cvc}
                getCvc={(value) => {
                  fieldChangeHandler("cvc", value); // Обновляет поле ввода
                  field.handleChange(value); // ТРИГГЕР ВАЛИДАЦИИ ФОРМЫ!
                }}
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

export default BankCard;
