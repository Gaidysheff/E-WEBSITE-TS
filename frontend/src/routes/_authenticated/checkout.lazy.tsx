import CheckoutSection from "@/components/checkout/CheckoutSection.tsx";
import DeliveryOptions from "@/components/checkout/DeliveryOptions.tsx";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { type DeliveryOption, type PaymentMethod } from "@/lib/types.ts";
import { options } from "@/components/checkout/DeliveryOptions.tsx";
import { useCart } from "@/store/CartContext.tsx";
import { useUser } from "@/store/UserContext.tsx";
import ShippingInfo from "@/components/profile/ShippingInfo.tsx";
import AddressFormTanstack from "@/components/order/AddressFormTanstack.tsx";
import { Truck, MapPin, CreditCard, Zap } from "lucide-react";
import PaymentMethodToggle from "@/components/checkout/PaymentMethodToggle.tsx";
import { NumericFormat } from "react-number-format";
import BankCardWithAnimation from "@/components/bankCard/BankCardWithAnimation.tsx";
import Modal from "@/components/uiComponents/Modal.tsx";
import YandexMap from "@/components/map/YandexMap.tsx";

export const Route = createLazyFileRoute("/_authenticated/checkout")({
  component: RouteComponent,
});

function RouteComponent() {
  const [delivery, setDelivery] = useState<DeliveryOption>(options[0]); // По умолчанию самовывоз

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const { user, isLoading } = useUser();
  const address = user?.address;

  const { totalPrice } = useCart();

  const finalTotal = totalPrice + delivery.price;

  const CardDataHandler = (CardData: Record<string, string>) => {
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
              handle3DSecure(result.AcsUrl, result.PaReq, result.TransactionId);
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
    <div
      className="grid lg:grid-cols-12 gap-8 sm:py-10
    scale-[0.85] 2xsm:scale-[0.9] xsm:scale-[0.95] sm:scale-100"
    >
      {/* ЛЕВАЯ ЧАСТЬ (8 колонок) */}
      <div className="lg:col-span-8 space-y-6 max-2xsm:-mt-40 max-xsm:-mt-20 max-sm:-mt-8">
        {/* ----------------- 1. Получатель и Адрес ----------------- */}
        <CheckoutSection title="1. Shipping Address" icon={<MapPin />}>
          <ShippingInfo user={user} isLoading={isLoading} forCheckoutPage />
          <Modal
            addressForm
            address={address}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          >
            <AddressFormTanstack
              address={address}
              setIsModalOpen={setIsModalOpen}
            />
          </Modal>
          {/* {user?.address?.street ? (
            <ShippingInfoPreview
              user={user}
              isLoading={isLoading}
              // onEdit={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="p-4 border-2 border-dashed rounded-xl">
              <p className="text-gray-500 mb-4 text-sm">
                Please provide a shipping address
              </p>
              <AddressFormTanstack
                address={user?.address}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          )} */}
        </CheckoutSection>
        {/* ---------------------- 2. Доставка ---------------------- */}

        <CheckoutSection title="2. Delivery Method" icon={<Truck />}>
          <DeliveryOptions
            selectedId={delivery.id}
            onSelect={(option) => setDelivery(option)}
          />
          {delivery.id === "pickup" && (
            <div className="mt-6">
              <YandexMap />
            </div>
          )}
        </CheckoutSection>

        {/* ----------------------- 3. Оплата ----------------------- */}
        <CheckoutSection title="3. Payment Method" icon={<CreditCard />}>
          <PaymentMethodToggle
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />

          {paymentMethod === "card" && (
            <div className="mt-6">
              <BankCardWithAnimation onSubmitData={CardDataHandler} />
            </div>
          )}
          {paymentMethod === "sbp" && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl text-center border-2 border-dashed">
              <Zap className="mx-auto mb-2 text-myMainColor" />
              <p className="text-sm text-gray-600">
                QR-code will be generated after clicking "Pay"
              </p>
            </div>
          )}
        </CheckoutSection>
        {/* ---------- 4. Обзор товаров (Компактный список) ---------- */}
        <div className="opacity-60">
          <h3 className="text-sm font-medium mb-4">Review Items</h3>
          {/* {cartItems.map((item) => (
            <MiniCartItem key={item.id} item={item} />
          ))} */}
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ (4 колонки) — СТИКИ-БЛОК */}
      <div className="lg:col-span-4">
        <div
          className="sticky top-24 p-6 rounded-2xl border
          border-gray-100"
        >
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Items total</span>
              <span>
                <NumericFormat
                  value={totalPrice}
                  displayType={"text"}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator=" "
                  decimalSeparator="."
                  // prefix={"$ "}
                  suffix={" ₽"}
                />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                <NumericFormat
                  value={delivery.price}
                  displayType={"text"}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator=" "
                  decimalSeparator="."
                  // prefix={"$ "}
                  suffix={" ₽"}
                />
              </span>
            </div>
            <div
              className="border-t pt-3 mt-3 flex justify-between
              font-bold text-lg"
            >
              <span>Total</span>
              <span className="text-myMainColor">
                <NumericFormat
                  value={finalTotal}
                  displayType={"text"}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator=" "
                  decimalSeparator="."
                  // prefix={"$ "}
                  suffix={" ₽"}
                />
              </span>
            </div>
          </div>

          <button
            // disabled={!canPay}
            type="button"
            className="w-full mt-8 bg-primaryDarker text-primaryLighter h-auto
            p-3 rounded-xl transition-transform cursor-pointer
            text-sm xsm:text-base sm:text-lg lg:text-base xl:text-lg
            border-2 border-primaryDark
            hover:bg-primary hover:scale-105 transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            drop-shadow-[5px_5px_5px_rgba(0,0,0,0.5)]
            dark:shadow-[5px_5px_5px_rgba(255,255,255,0.5)]"
          >
            <span className="lg:hidden">Place Order & Pay </span>
            <span className="max-lg:hidden">
              Place Order <br /> & <br />
              Pay{" "}
            </span>
            <NumericFormat
              value={finalTotal}
              displayType={"text"}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator=" "
              decimalSeparator="."
              // prefix={"$ "}
              suffix={" ₽"}
              className="font-bold"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
