import Globe from "@/assets/images/payment/globe.svg";
import { type BankCardSchemaType } from "@/components/bankCard/bankCardSchema.ts";
import { type AnyReactForm } from "@/lib/types.ts";
import { useStore, type AnyFieldApi } from "@tanstack/react-form";
import { useEffect, useRef, useState, type FormEvent } from "react";
import "./style.css";

import CardDisplay from "./CardDisplay.tsx";
import CardForm from "./CardForm.tsx";

interface FormProps {
  bankCardForm: AnyReactForm<BankCardSchemaType>;
}

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

const BankCardWithAnimation = ({ bankCardForm }: FormProps) => {
  // Подписываемся на значения через useStore (Вариант-1)
  const formValues = useStore(bankCardForm.store, (state) => state.values);

  const monthTouched = useStore(
    bankCardForm.store,
    (state) => state.fieldMeta.month?.isTouched,
  );
  const yearTouched = useStore(
    bankCardForm.store,
    (state) => state.fieldMeta.year?.isTouched,
  );

  // Стейт для анимации переворота
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

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

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    bankCardForm.handleSubmit();
  };

  // ==================== Звук перелистывания ========================
  // 1. Создаем реф для аудио, чтобы он жил весь цикл компонента
  const swooshAudio = useRef<HTMLAudioElement | null>(null);

  const playSwoosh = () => {
    if (swooshAudio.current) {
      swooshAudio.current.currentTime = 0;
      // Сбрасываем на начало, если кликнули быстро
      swooshAudio.current.volume = 0.3;
      swooshAudio.current.play().catch(() => {});
    }
    // const audio = new Audio("/page-flip-sound.mp3");
    // // Путь к файлу в папке public
    // audio.volume = 0.3; // Не делайте слишком громко
    // audio.play().catch(() => {});
    // // Игнорируем ошибку, если браузер блокирует звук
  };

  useEffect(() => {
    // 2. Инициализируем и предзагружаем
    swooshAudio.current = new Audio("/page-flip-sound.mp3");
    swooshAudio.current.load(); // Принудительная загрузка в кэш
  }, []);

  // В useEffect, который следит за разворотом
  useEffect(() => {
    // Проигрываем звук только если это не первый рендер
    if (isFlipped !== undefined) {
      playSwoosh();
    }
  }, [isFlipped]);

  return (
    <div className="grid 2xl:grid-cols-2 gap-1 xsm:gap-6 lg:gap-10">
      {/* --------- Card Display --------- */}

      <div className="relative z-2 flex justify-center items-center overflow-hidden w-full h-auto sm:h-[16.5rem]">
        <div
          className="origin-center transition-transform 
          scale-[0.55] 2xsm:scale-[0.72] xsm:scale-[0.95] sm:scale-100"
        >
          <CardDisplay
            isFlipped={isFlipped}
            cardType={cardType}
            formValues={formValues}
            monthTouched={monthTouched}
            yearTouched={yearTouched}
          />
        </div>
      </div>

      {/* Настоящий скрытый инпут поверх всей карты или под ней */}
      <input
        type="tel"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        maxLength={19}
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
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        maxLength={30}
        value={formValues.userName}
        onChange={(e) => {
          updateField("userName", e.target.value);
        }}
      />
      <input
        type="tel"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        maxLength={2}
        value={formValues.month}
        onChange={(e) => {
          updateField("month", e.target.value);
        }}
      />
      <input
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        type="tel"
        maxLength={2}
        value={formValues.year}
        onChange={(e) => {
          updateField("year", e.target.value);
        }}
      />
      <input
        type="tel"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        maxLength={3}
        value={formValues.cvc}
        onChange={(e) => {
          updateField("cvc", e.target.value);
        }}
      />
      {/* --------- Card Form --------- */}
      <div className="scale-[0.95] 2xsm:scale-[0.97] xsm:scale-100">
        <CardForm
          onSubmit={submitHandler}
          bankCardForm={bankCardForm}
          setIsFlipped={setIsFlipped}
          setCardType={setCardType}
          onFieldChange={updateField}
        />
      </div>
    </div>
  );
};

export default BankCardWithAnimation;
