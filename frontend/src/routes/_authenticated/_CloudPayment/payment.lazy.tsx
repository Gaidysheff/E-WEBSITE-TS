import BankCard from "@/components/payment/BankCard";
import BankCardWithAnimation from "@/components/paymentWithAnimation/BankCardWithAnimation";
import CloudPayments from "@/components/svgImages/CloudPayments";
import { createLazyFileRoute } from "@tanstack/react-router";
import { paymentActionCP } from "@/api/actions.ts";
import { useState } from "react";
import { type PaymentResponse } from "@/lib/types.ts";

import { useCart } from "@/store/CartContext.tsx";
import { useUser } from "@/store/UserContext.tsx";

export const Route = createLazyFileRoute(
  "/_authenticated/_CloudPayment/payment",
)({
  component: Payment,
});

function Payment() {
  const [inputError, setInputError] = useState<string | undefined>("");
  // console.log("🚀 ~ CardDataHandler ~ inputError:", inputError);

  const { items, totalPrice } = useCart();
  const { user, isLoading } = useUser();

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
            amount: totalPrice,
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
              setInputError(result.Message);
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

      if (isLoading) return; // Ждем загрузки профиля

      const userEmail = user?.email || "guest@example.com";
      const userPhone = user?.address?.phone;
      const fullName = `${user?.first_name} ${user?.last_name}`;
      const orderAddress = `${user?.address?.state}, ${user?.address?.city}, ${user?.address?.street}`;

      // 1. Собираем данные для чека (Customer & Items)
      // Эти данные обычно приходят из контекста корзины или профиля
      const customerReceipt = {
        Items: items.map((item) => ({
          label: item.product.name, // Наименование товара
          price: item.product.price, // Цена за единицу
          quantity: item.quantity, // Количество
          amount: item.product.price * item.quantity, // Сумма по позиции
          vat: 22, // Ставка НДС (если есть)
          method: 0, // Признак способа расчета (полная оплата)
          object: 0, // Признак предмета расчета (товар)
        })),
        email: userEmail, // Обязательно для электронного чека
        phone: userPhone, // Обязательно, если нет email
        taxationSystem: 0, // Система налогообложения магазина
      };

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

          // 2. Формируем финальный объект для нашего Бэкенда
          const paymentData = {
            amount: totalPrice, // Из useCart
            currency: "RUB",
            name: CardData.userName, // Для банковского эквайринга (латиница)
            cryptogram: cryptogram, // Используем НАСТОЯЩУЮ криптограмму
            invoiceId: `INV-${Date.now()}`, // Генерация ID заказа
            description: `Оплата заказа в магазине`,
            // Добавляем данные для фискализации
            jsonData: JSON.stringify({
              customerReceipt, // Облачная касса возьмет данные отсюда
              userContact: fullName, // Настоящее имя из профиля
              address: orderAddress, // Адрес доставки
            }),
          };

          try {
            const result = (await paymentActionCP(
              paymentData,
            )) as PaymentResponse;

            if (result.Success) {
              resolve(result); // Успех: перенаправляем на страницу "Спасибо"
            } else if (result.Message === "Need3dSecure") {
              // Имитация 3D Secure (если транзакция требует подтверждения SMS)
              // handle3DSecure(result.AcsUrl, result.PaReq, result.TransactionId);
            } else {
              reject(result.Message); // Ошибка: например, "Недостаточно средств"
            }
          } catch (apiError) {
            reject("Ошибка связи с сервером");
          }
        })
        .catch((errors) => {
          console.log("🚀 ~ CardWithAnimationDataHandler ~ errors:", errors);
          reject("Ошибка валидации карты на стороне шлюза");
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
