import BankCard from "@/components/payment/BankCard";
import BankCardWithAnimation from "@/components/paymentWithAnimation/BankCardWithAnimation";
import CloudPayments from "@/components/svgImages/CloudPayments";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

// interface CloudPayments {
//   Checkout: new (options: { publicId: string }) => {
//     createPaymentCryptogram: (values: any) => Promise<string>;
//   };
// }

// declare const cp: CloudPayments;

export const Route = createLazyFileRoute(
  "/_authenticated/_CloudPayment/payment",
)({
  component: Payment,
});

const ERROR_MESSAGES: Record<string, string> = {
  CardNumber_Invalid: "Карта не проходит проверку (алгоритм Луна)",
  Cvv_Invalid: "Некорректный CVC/CVV код",
  ExpDateMonth_Invalid: "Проверьте месяц истечения",
  ExpDateYear_Invalid: "Проверьте год истечения",
  // Добавляем только те, что могут проскочить через нашу Zod-валидацию
};

function Payment() {
  const [inputError, setInputError] = useState<string>("");
  console.log("🚀 ~ CardDataHandler ~ inputError:", inputError);

  const CardDataHandler = (CardData: Record<string, string>) => {
    return new Promise((resolve, reject) => {
      // Возвращаем Promise

      // Массив и join (Самый чистый способ)
      const cardNumber = [
        CardData.firstSet,
        CardData.secondSet,
        CardData.thirdSet,
        CardData.fourthSet,
        CardData.additionalSet,
      ].join(""); // Склеит всё в одну строку без пробелов

      console.log("🚀 ~ CardDataHandler ~ cardNumber:", cardNumber);
      console.log("🚀 ~ CardDataHandler ~ CardData:", CardData);

      // ================== Код от CloudPayments =============================

      const checkout = new cp.Checkout({
        publicId: "test_api_000000000000000002",
      });

      const fieldValues = {
        cvv: CardData.cvc,
        cardNumber: cardNumber,
        expDateMonth: CardData.month,
        expDateYear: CardData.year.slice(-2), // Превратит "2026" в "26"
      };

      checkout
        .createPaymentCryptogram(fieldValues)
        .then((cryptogram: string) => {
          // Здесь отправляем криптограмму на ваш бэкенд для совершения платежа
          console.log("Криптограмма успешно создана:", cryptogram);
          resolve(cryptogram); // Завершаем успешно
        })
        .catch((errors: Record<string, string>) => {
          // Здесь обрабатываем ошибки (например, неверный номер карты)
          console.error("Ошибка создания криптограммы:", errors);

          // Ищем первую попавшуюся ошибку в нашем словаре
          const firstErrorCode = Object.values(errors)[0];
          const message =
            ERROR_MESSAGES[firstErrorCode] || "Ошибка проверки карты";

          setInputError(message);
          reject(errors); // Завершаем с ошибкой, чтобы кнопка разблокировалась
        });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1
        className="text-lg 2xsm:text-2xl xsm:text-3xl sm:text-4xl md:text-5xl 
        mt-5 sm:mt-10 -mr-[2rem] 2xsm:-mr-[2.4rem] xsm:-mr-[3rem] sm:-mr-[4rem]
        text-primaryDark"
      >
        Payment with
      </h1>
      <p></p>

      <div
        className="w-[15rem] 2xsm:w-[18rem] xsm:w-[22.5rem] sm:w-[30rem]
        -mr-[2rem] 2xsm:-mr-[2.4rem] xsm:-mr-[3rem] sm:-mr-[4rem] mt-5 sm:mt-10"
      >
        <CloudPayments />
      </div>
      <div className="my-10 sm:my-20">
        {inputError && (
          <p className="bg-red-500 text-lg text-white p-2 mb-5">{inputError}</p>
        )}
        <BankCard onSubmitData={CardDataHandler} />
      </div>
      <div className="my-10 sm:my-20">
        <BankCardWithAnimation onSubmitData={CardDataHandler} />
      </div>
    </div>
  );
}
