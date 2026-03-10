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

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { CURRENT_YEAR } from "@/lib/utils.ts";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm, useStore, type AnyFieldApi } from "@tanstack/react-form";
import {
  useState,
  useRef,
  type FormEvent,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";

interface FormProps {
  onSubmitData: (data: Record<string, string>) => Promise<any>;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  setCardType: Dispatch<SetStateAction<string>>;
}

const bankCardSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d+$/, { message: "cvc must contain only digits" })
    .refine((val) => val.length === 16 || val.length === 19, {
      message: "Must be 16 or 19 digits ",
    }),
  userName: z
    .string()
    .min(1, { message: "Name is required" })
    // Ensures the input is a string and not empty
    .min(2, { message: "Name must be at least 2 characters" })
    // Ensures minimum length
    .regex(/^[a-zA-Z\s]+$/, "Only latin letters"),
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

function FieldInfo({ field }: { field: AnyFieldApi }) {
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

const CardForm = ({ onSubmitData, setIsFlipped, setCardType }: FormProps) => {
  const bankCardForm = useForm({
    defaultValues: {
      cardNumber: "",
      userName: "",
      cvc: "",
      month: "1",
      year: String(CURRENT_YEAR),
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

  // Создаем массив годов прямо перед рендером
  const dynamicYears = Array.from({ length: 11 }, (_, i) =>
    String(CURRENT_YEAR + i),
  );

  // (Опционально) Можно так же сгенерировать месяцы,
  // чтобы не писать 12 тегов <option> вручную
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  // Подписываемся на значения через useStore
  const formValues = useStore(bankCardForm.store, (state) => state.values);

  useEffect(() => {
    const number = formValues.cardNumber;

    if (!number) {
      setCardType(Globe);
    } else if (number.match(/^220[0-4]/)) {
      setCardType(Mir);
    } else if (number.match(/^3[0689]/)) {
      setCardType(DinersClub);
    } else if (number.startsWith("31")) {
      setCardType(China_T_Union);
    } else if (number.startsWith("34") || number.startsWith("37")) {
      setCardType(AmEx);
    } else if (number.startsWith("35")) {
      setCardType(JCB);
    } else if (number.startsWith("4")) {
      setCardType(Visa);
    } else if (
      number.match(/^222[123456789]/) ||
      number.match(/^2[34567]/) ||
      number.match(/^5[12345]/)
    ) {
      setCardType(Master);
    } else if (
      number.startsWith("5018") ||
      number.startsWith("5020") ||
      number.startsWith("5038") ||
      number.startsWith("5893") ||
      number.startsWith("6304") ||
      number.startsWith("6759") ||
      number.startsWith("6761") ||
      number.startsWith("6762") ||
      number.startsWith("6763")
    ) {
      setCardType(Maestro);
    } else if (number.startsWith("62")) {
      setCardType(UnionPay);
    } else if (
      number.startsWith("6011") ||
      number.match(/^64[456789]/) ||
      number.startsWith("65")
    ) {
      setCardType(Discover);
    } else if (
      number.match(/^6[05]/) ||
      number.match(/^8[12]/) ||
      number.startsWith("508")
    ) {
      setCardType(RuPay);
    } else {
      setCardType(Globe);
    }
  }, [formValues.cardNumber]);

  return (
    <div className="">
      <form className="w-full" autoComplete="off">
        <FieldGroup>
          <bankCardForm.Field
            name="cardNumber"
            children={(field) => (
              <div>
                <FieldLabel htmlFor="cardNumber">Number</FieldLabel>
                <Input
                  id="cardNumber"
                  type="tel"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onClick={() => setIsFlipped(false)}
                  inputMode="numeric"
                  placeholder="16 or 19 digits"
                  pattern={`[0-9]${16 | 19}`}
                  required
                />
                <FieldInfo field={field} />
              </div>
            )}
          />

          <bankCardForm.Field
            name="userName"
            children={(field) => (
              <div>
                <FieldLabel htmlFor="userName">Name</FieldLabel>
                <Input
                  id="userName"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onClick={() => setIsFlipped(false)}
                  placeholder="card holder's name"
                  required
                />
                <FieldInfo field={field} />
              </div>
            )}
          />

          <div className="grid grid-cols-5 gap-4">
            <div className="">
              <Field>
                <div>
                  <FieldLabel htmlFor="form-month">Month</FieldLabel>
                  <Select defaultValue="01">
                    <SelectTrigger id="form-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Рендерим месяцы через map */}
                      {months.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>
            </div>
            <div className="col-span-2">
              <Field>
                <div>
                  <FieldLabel htmlFor="form-year">Year</FieldLabel>
                  <Select defaultValue="2026">
                    <SelectTrigger id="form-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Рендерим годы через map */}
                      {dynamicYears.map((dynamicYear) => (
                        <SelectItem key={dynamicYear} value={dynamicYear}>
                          {dynamicYear}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>
            </div>
            <span></span>
            <div className="w-[4rem] flex justify-end">
              <bankCardForm.Field
                name="cvc"
                children={(field) => (
                  <div className="w-[2.6rem]">
                    <FieldLabel htmlFor="cvc">
                      <p className="w-full text-center">CVC</p>
                    </FieldLabel>
                    <Input
                      id="cvc"
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onClick={() => setIsFlipped(true)}
                      placeholder=""
                      inputMode="numeric"
                      maxLength={3}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              />
            </div>
          </div>
          <Field orientation="horizontal">
            <Button type="reset" variant="outline">
              Reset
            </Button>
            <Button type="submit" disabled={false}>
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default CardForm;
