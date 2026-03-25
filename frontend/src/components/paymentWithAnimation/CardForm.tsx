import AmEx from "@/assets/images/payment/american-express.svg";
import China_T_Union from "@/assets/images/payment/china_t-union.svg";
import DinersClub from "@/assets/images/payment/diners-club.svg";
import Discover from "@/assets/images/payment/discover.svg";
import Globe from "@/assets/images/payment/globe.svg";
import JCB from "@/assets/images/payment/jcb.svg";
import Maestro from "@/assets/images/payment/maestro.svg";
import Master from "@/assets/images/payment/master_card_with_fill.svg";
import Mir from "@/assets/images/payment/mir.svg";
import RuPay from "@/assets/images/payment/ru_pay.svg";
import UnionPay from "@/assets/images/payment/union_pay.svg";
import Visa from "@/assets/images/payment/visa.svg";
import { useCart } from "@/store/CartContext.tsx";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Info } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CURRENT_YEAR } from "@/lib/utilities.ts";

import {
  useEffect,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

import { type AnyReactForm } from "@/lib/types.ts";
import { useStore } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import {
  FieldInfo,
  type BankCardSchemaType,
} from "./BankCardWithAnimation.tsx";

interface FormProps {
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  setCardType: Dispatch<SetStateAction<string>>;
  onFieldChange: (field: keyof BankCardSchemaType, value: string) => void;
  bankCardForm: AnyReactForm<BankCardSchemaType>;
  onSubmit: (event: FormEvent<Element>) => void;
}

export function CvcBubbleError({ field }: { field: AnyFieldApi }) {
  const error = field.state.meta.errors[0]?.message;

  if (!field.state.meta.isTouched || !error) return null;

  return (
    <div
      className="absolute -top-2 left-1/2 -translate-x-1/2 z-50 
    animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      <div
        className="bg-destructive text-white text-sm px-2 py-1
      rounded-md whitespace-nowrap shadow-lg relative"
      >
        {error}
        {/* Маленький треугольник (хвостик) снизу */}
        <div
          className="absolute -bottom-1 w-2 h-2 bg-destructive rotate-45
        left-1/2 -translate-x-1/2"
        />
      </div>
    </div>
  );
}

const CardForm = ({
  bankCardForm,
  onSubmit,
  setIsFlipped,
  setCardType,
  onFieldChange,
}: FormProps) => {
  const { cartCode } = useCart();

  // Подписываемся на значения через useStore
  const formValues = useStore(bankCardForm.store, (state) => state.values);

  // Создаем массив годов прямо перед рендером
  const dynamicYears = Array.from({ length: 11 }, (_, i) =>
    String(CURRENT_YEAR + i),
  );

  // (Опционально) Можно так же сгенерировать месяцы,
  // чтобы не писать 12 тегов <option> вручную
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

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
      <form className="w-full" autoComplete="off" onSubmit={onSubmit}>
        <FieldGroup>
          <bankCardForm.Field
            name="cardNumber"
            children={(field) => (
              <div>
                <FieldLabel htmlFor="cardNumber">Number</FieldLabel>
                <Input
                  id="cardNumber"
                  autoComplete="cc-number"
                  type="tel"
                  value={field.state.value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 19) {
                      onFieldChange("cardNumber", val);
                    }
                  }}
                  // Подсвечиваем только если есть ошибка
                  // и пользователь уже вошёл конкретно в это поле ввода
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                  onClick={() => setIsFlipped(false)}
                  inputMode="numeric"
                  placeholder="16 or 19 digits"
                  pattern="(\d{16}|\d{19})"
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
                  autoComplete="cc-name"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Обновляем в TanStack Form
                    field.handleChange(val);
                    // Синхронизируем с нашим общим обработчиком (для карты-дисплея)
                    onFieldChange("userName", val);
                  }}
                  // Подсвечиваем только если есть ошибка И пользователь уже ушел из поля (blur)
                  errors={
                    field.state.meta.isTouched ? field.state.meta.errors : []
                  }
                  onClick={() => setIsFlipped(false)}
                  placeholder="card holder's name"
                  required
                />
                <FieldInfo field={field} />
              </div>
            )}
          />

          <div className="grid grid-cols-4 xsm:grid-cols-5 gap-4">
            <div className="">
              <bankCardForm.Field
                name="month"
                children={(field) => (
                  <Field>
                    <div>
                      <FieldLabel htmlFor="form-month">Month</FieldLabel>
                      {/* 1. value связываем со стейтом формы */}
                      {/* 2. onValueChange заменяет нам стандартный onChange */}
                      <Select
                        value={field.state.value || "01"}
                        onValueChange={(val) => {
                          // Обновляем в TanStack Form
                          field.handleChange(val);
                          // Синхронизируем с нашим общим обработчиком (для карты-дисплея)
                          onFieldChange("month", val);
                        }}
                        // Когда открываем список - убеждаемся, что карта лицом к нам
                        onOpenChange={(open) => {
                          if (open) setIsFlipped(false);
                        }}
                      >
                        <SelectTrigger
                          id="form-month"
                          onBlur={field.handleBlur}
                          // value и onChange здесь НЕ НУЖНЫ, они должны быть в корне <Select>
                        >
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Не забываем выводить ошибки, если они есть */}
                      <FieldInfo field={field} />
                    </div>
                  </Field>
                )}
              />
            </div>
            <div className="xsm:col-span-2">
              <bankCardForm.Field
                name="year"
                children={(field) => (
                  <Field>
                    <div>
                      <FieldLabel htmlFor="form-year">Year</FieldLabel>
                      {/* 1. value связываем со стейтом формы */}
                      {/* 2. onValueChange заменяет нам стандартный onChange */}
                      <Select
                        value={field.state.value || String(CURRENT_YEAR)}
                        onValueChange={(val) => {
                          // Обновляем в TanStack Form
                          field.handleChange(val);
                          // Синхронизируем с вашим общим обработчиком (для карты-дисплея)
                          onFieldChange("year", val);
                        }}
                        // Когда открываем список - убеждаемся, что карта лицом к нам
                        onOpenChange={(open) => {
                          if (open) setIsFlipped(false);
                        }}
                      >
                        <SelectTrigger
                          id="form-year"
                          onBlur={field.handleBlur}
                          // value и onChange здесь НЕ НУЖНЫ, они должны быть в корне <Select>
                        >
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
                      {/* Не забываем выводить ошибки, если они есть */}
                      <FieldInfo field={field} />
                    </div>
                  </Field>
                )}
              />
            </div>
            <span></span>
            <div className="w-[4rem]">
              <bankCardForm.Field
                name="cvc"
                children={(field) => (
                  <div className="w-full flex flex-col items-end relative">
                    {/* <FieldLabel htmlFor="cvc">
                      <p className="w-full whitespace-nowrap">CVC/CVV/CVP</p>
                    </FieldLabel> */}
                    <FieldLabel
                      htmlFor="cvc"
                      className="flex items-center gap-1"
                    >
                      <p className="w-full whitespace-nowrap">CVC/CVV/CVP</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info
                              className="size-3.5 text-myMainColor
                              opacity-50 cursor-help hover:opacity-100
                              transition-opacity"
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-[200px] text-xs"
                          >
                            Это 3-значный код безопасности на обратной стороне
                            вашей карты.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FieldLabel>
                    <Input
                      className="text-center"
                      id="cvc"
                      autoComplete="cc-cvc"
                      type="tel"
                      value={field.state.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Обновляем в TanStack Form
                        field.handleChange(val);
                        // Синхронизируем с нашим общим обработчиком
                        // (для карты-дисплея)
                        onFieldChange("cvc", val);
                      }}
                      // Подсвечиваем только если есть ошибка И пользователь уже ушел из поля (blur)
                      errors={
                        field.state.meta.isTouched
                          ? field.state.meta.errors
                          : []
                      }
                      onClick={() => setIsFlipped(true)}
                      placeholder=""
                      inputMode="numeric"
                      maxLength={3}
                    />
                    <CvcBubbleError field={field} />
                  </div>
                )}
              />
            </div>
          </div>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" asChild>
              <Link from="/" to={`cart/${cartCode}`}>
                Cancel
              </Link>
            </Button>
            <bankCardForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "..." : "Pay"}
                </Button>
              )}
            />
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default CardForm;
