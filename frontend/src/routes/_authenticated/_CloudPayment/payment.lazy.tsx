import BankCard from "@/components/payment/BankCard";
import BankCardWithAnimation from "@/components/paymentWithAnimation/BankCardWithAnimation";
import CloudPayments from "@/components/svgImages/CloudPayments";
import { createLazyFileRoute } from "@tanstack/react-router";
import { paymentActionCP } from "@/api/actions.ts";
import { useCart } from "@/store/CartContext.tsx";
import { useState } from "react";
import { type PaymentResponse } from "@/lib/types.ts";
export const Route = createLazyFileRoute(
  "/_authenticated/_CloudPayment/payment",
)({
  component: Payment,
});

function Payment() {
  const [inputError, setInputError] = useState<string>("");
  // console.log("🚀 ~ CardDataHandler ~ inputError:", inputError);

  const { items, totalPrice } = useCart();
  console.log("🚀 ~ CardDataHandler ~ totalPrice:", totalPrice);
  console.log("🚀 ~ CardDataHandler ~ items:", items);

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

      // console.log("🚀 ~ CardDataHandler ~ cardNumber:", cardNumber);
      // console.log("🚀 ~ CardDataHandler ~ CardData:", CardData);

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
        .then(async (cryptogram: string) => {
          // Криптограмма готова!
          console.log("Криптограмма успешно создана:", cryptogram);

          // Теперь собираем финальный пакет
          const paymentData = {
            amount: 123,
            currency: "RUB",
            name: CardData.userName, // Берем реальное имя из формы
            cryptogram: cryptogram, // Используем НАСТОЯЩУЮ криптограмму
            invoiceId: "11111",
            description: "something",
          };

          // resolve(cryptogram); // Завершаем успешно
          try {
            // 2. Отправляем в Django и ждем ответа
            const result = (await paymentActionCP(
              paymentData,
            )) as PaymentResponse;

            if (result.Success) {
              resolve(result); // Кнопка разблокируется, всё супер
            } else {
              reject(result.Message); // Показываем ошибку от банка
            }
          } catch (apiError) {
            reject(apiError);
          }
        })
        .catch((errors) => {
          // Ошибки самого скрипта checkout.js (неверный номер и т.д.)
          reject(errors);
        });
    });
  };

  const CardWithAnimationDataHandler = (CardData: Record<string, string>) => {
    return new Promise((resolve, reject) => {
      // Возвращаем Promise

      // ================== Код от CloudPayments =============================
      const checkout = new cp.Checkout({
        publicId: "test_api_000000000000000002",
      });

      const fieldValues = {
        cvv: CardData.cvc,
        cardNumber: CardData.cardNumber,
        expDateMonth: CardData.month,
        expDateYear: CardData.year.slice(-2), // Превратит "2026" в "26"
      };

      checkout
        .createPaymentCryptogram(fieldValues)
        .then(async (cryptogram: string) => {
          // Криптограмма готова!
          console.log("Криптограмма успешно создана:", cryptogram);

          // Теперь собираем финальный пакет
          const paymentData = {
            amount: 123,
            currency: "RUB",
            name: CardData.userName, // Берем реальное имя из формы
            cryptogram: cryptogram, // Используем НАСТОЯЩУЮ криптограмму
            invoiceId: "11111",
            description: "something",
          };

          // resolve(cryptogram); // Завершаем успешно
          try {
            // 2. Отправляем в Django и ждем ответа
            const result = (await paymentActionCP(
              paymentData,
            )) as PaymentResponse;

            if (result.Success) {
              resolve(result); // Кнопка разблокируется, всё супер
            } else {
              reject(result.Message); // Показываем ошибку от банка
            }
          } catch (apiError) {
            reject(apiError);
          }
        })
        .catch((errors) => {
          // Ошибки самого скрипта checkout.js (неверный номер и т.д.)
          reject(errors);
        });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1
        className="text-lg 2xsm:text-2xl xsm:text-3xl sm:text-4xl md:text-5xl 
        mt-5 sm:mt-10 -mr-[2rem] 2xsm:-mr-[2.4rem] xsm:-mr-[3rem] sm:-mr-[4rem]
        text-primaryDark z-2"
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

      <div className="z-5">
        <p className="mt-10 text-xl">
          В тестовом режиме используйте номер карты 4242 4242 4242 4242
          (остальные данные карты любые), чтобы получить успешное прохождение
          платежа.
        </p>
        <p className="mt-10 text-xl">
          Для отказа платежа используйте любой 16-ти или 19-ти значный номер.
        </p>
      </div>

      <div className="my-10 sm:my-20 z-4">
        {inputError && (
          <p className="bg-red-500 text-lg text-white p-2 mb-5">{inputError}</p>
        )}
        <BankCard onSubmitData={CardDataHandler} />
      </div>
      <div className="my-10 sm:my-20 z-3">
        <BankCardWithAnimation onSubmitData={CardWithAnimationDataHandler} />
      </div>
    </div>
  );
}
