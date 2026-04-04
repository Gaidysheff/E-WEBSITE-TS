import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { BASE_URL } from "@/api/api.ts";
import CheckoutSection from "@/components/checkout/CheckoutSection.tsx";
import DeliveryOptions from "@/components/checkout/DeliveryOptions.tsx";
import { paymentActionCP } from "@/api/actions.ts";
import BankCardWithAnimation from "@/components/bankCard/BankCardWithAnimation.tsx";
import { options } from "@/components/checkout/DeliveryOptions.tsx";
import PaymentMethodToggle from "@/components/checkout/PaymentMethodToggle.tsx";
import YandexMap from "@/components/map/YandexMap.tsx";
import AddressFormTanstack from "@/components/order/AddressFormTanstack.tsx";
import ShippingInfo from "@/components/profile/ShippingInfo.tsx";
import Modal from "@/components/uiComponents/Modal.tsx";
import {
  type DeliveryOption,
  type PaymentMethod,
  type CPResponse,
} from "@/lib/types.ts";
import { useCart } from "@/store/CartContext.tsx";
import { useUser } from "@/store/UserContext.tsx";
import { useForm } from "@tanstack/react-form";
import {
  CreditCard,
  MapPin,
  Truck,
  Zap,
  PackageSearch,
  Loader,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import MiniCartItem from "@/components/checkout/MiniCartItem.tsx";
import {
  bankCardSchema,
  type BankCardSchemaType,
} from "@/components/bankCard/bankCardSchema.ts";
import { CURRENT_YEAR } from "@/lib/utilities.ts";
import { Spinner } from "@/components/ui/spinner";
import PaymentLoader from "@/components/loader/PaymentLoader.tsx";

export const Route = createLazyFileRoute("/_authenticated/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const [delivery, setDelivery] = useState<DeliveryOption>(options[0]); // По умолчанию самовывоз

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const { items, totalPrice, cartCode } = useCart();
  const { user, isLoading } = useUser();

  const address = user?.address;
  const finalTotal = totalPrice + delivery.price;

  const navigate = useNavigate();

  // ----------------- TanStack Form -----------------------
  // Создаем форму ЗДЕСЬ, чтобы иметь к ней полный доступ

  const bankCardForm = useForm({
    defaultValues: {
      cardNumber: "",
      userName: "",
      cvc: "",
      month: "01",
      year: String(CURRENT_YEAR),
    } as BankCardSchemaType,

    validators: {
      onChange: bankCardSchema,
      // onChangeAsync: bankCardSchema,
      // onChangeAsyncDebounceMs: 500,

      // 1. Валидируем при загрузке (чтобы кнопка знала статус сразу)
      onMount: bankCardSchema, // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА ПРИ ЗАГРУЗКЕ
      // 2. Валидируем при каждом вводе символа
      // onChange: bankCardSchema,
    },

    onSubmit: async ({ value }) => {
      // 1. TanStack Form сам поставит isSubmitting в true
      // Кнопка переключится в "Processing...", пока этот await не завершится
      try {
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        // await CardDataHandler(value); // Вызываем обработчик оплаты
        console.log("Submit started"); // Проверьте в консоли
        console.log("Submit finished");
        await CardDataHandler(value); // Обязательно await, иначе isSubmitting сразу станет false
      } catch (err) {
        console.error("Caught in onSubmit:", err);
        // Ошибка здесь вернет кнопку в обычное состояние
      }
      // 2. После завершения async функции isSubmitting вернется в false
    },
  });

  // ------------------ Валидация --------------------------
  // const canPay =
  //   (paymentMethod === "card" ? bankCardForm.state.canSubmit : true) &&
  //   (!!user?.address?.street || delivery.id === "pickup");

  // 1. Проверка адреса (если не самовывоз)
  const isAddressReady = delivery.id === "pickup" || !!user?.address?.street;

  // 2. Проверка карты (если выбран метод "card")
  // Мы берем состояние canSubmit из объекта bankCardForm,
  // который подняли в родителя
  // const isPaymentReady =
  //   paymentMethod === "card"
  //     ? bankCardForm.state.canSubmit && !bankCardForm.state.isSubmitting
  //     : true; // Для СБП/Яндекса пока считаем true

  // // Итоговое состояние кнопки
  // const canPay = isAddressReady && isPaymentReady && !isLoading;

  // -------- Сценарий 3D Secure (Эмуляция) ---------

  const [threeDSData, setThreeDSData] = useState<{
    acsUrl: string;
    paReq: string;
    transactionId: string;
  } | null>(null);

  const handle3DSecure = (
    acsUrl: string,
    paReq: string,
    transactionId: string,
  ) => {
    // 1. Создаем форму для отправки в банк
    const form = document.createElement("form");
    form.method = "POST";
    form.action = acsUrl;
    form.target = "three-d-secure-frame"; // Имя iframe в модалке

    // 2. Добавляем скрытые поля
    const inputs = {
      PaReq: paReq,
      MD: transactionId,
      TermUrl: "https://your-site.com",
    };
    Object.entries(inputs).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    setIsModalOpen(true); // Ваша модалка
    form.submit();
    document.body.removeChild(form);
    setThreeDSData({ acsUrl, paReq, transactionId });
  };

  // ----------------- Реализация 3D Secure ---------------------

  // const handle3DSecure = (url: string, paReq: string, md: string) => {
  //   setThreeDSData({ url, paReq, md });
  //   setIsModalOpen(true); // Ваша модалка
  // };
  // -----------------------------------------------------------
  const CardDataHandler = (CardData: Record<string, string>) => {
    return new Promise((resolve, reject) => {
      // Возвращаем Promise

      console.log("Начинаем имитацию оплаты...");

      // Искусственная пауза 3 секунды
      // new Promise((res) => setTimeout(res, 3000));

      if (isLoading) return; // Ждем загрузки профиля

      const userEmail = user?.email || "guest@example.com";
      const userPhone = user?.address?.phone;
      const fullName = `${user?.first_name} ${user?.last_name}`;
      const orderAddress = `${user?.address?.street}, ${user?.address?.city}, ${user?.address?.state}`;

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
        totalAmount: finalTotal,
        shippingMethod: delivery.id,
        paymentMethod: paymentMethod,
        // Если это самовывоз, адрес берем из константы магазина
        shippingAddress:
          delivery.id === "pickup"
            ? "Self-pickup: Pechatnikov 1"
            : orderAddress,
        taxationSystem: 0, // Система налогообложения магазина
      };

      // ================ Эмуляция =====================
      if (CardData.userName === "SUCCESS TEST") {
        new Promise((res) => setTimeout(res, 2000));
        navigate({ to: "/success" });
        return resolve({ Success: true });
      }

      if (CardData.userName === "FAIL TEST") {
        new Promise((res) => setTimeout(res, 2000));
        toast.error("Имитация ошибки: Карта отклонена");
        return reject("Declined");
      }

      // ================== Код от CloudPayments =============================
      const checkout = new cp.Checkout({
        publicId: "test_api_000000000000000001",
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
            cart_code: cartCode,
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
            const result = (await paymentActionCP(paymentData)) as CPResponse;

            if (result.Success) {
              toast.success("Payment successful!");
              navigate({ to: "/success" }); // Улетаем на страницу успеха
              resolve(result); // Успех: перенаправляем на страницу "Спасибо"
            } else if (result.Message === "Need3dSecure") {
              // Имитация 3D Secure (если транзакция требует подтверждения SMS)
              handle3DSecure(result.AcsUrl, result.PaReq, result.TransactionId);
            } else {
              // ВМЕСТО navigate({ to: "/failed" })
              // Просто показываем ошибку и позволяем юзеру попробовать снова
              toast.error(`Payment declined: ${result.Message}`, {
                position: "top-center",
                autoClose: 5000,
              });
              reject(result.Message); // Ошибка: например, "Недостаточно средств"
            }
          } catch (apiError) {
            toast.error("Connection error. Please try again.");
            reject("Ошибка связи с сервером - Network error");
          }
        })
        .catch((errors) => {
          console.log("🚀 ~ CheckoutPage ~ errors:", errors);
          reject("Ошибка валидации карты на стороне шлюза");
        });
    });
  };

  useEffect(() => {
    if (paymentMethod !== "card") {
      // Очищаем форму, если выбрали не карту
      bankCardForm.reset();
    }
  }, [paymentMethod]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isModalOpen && threeDSData && formRef.current) {
      // Небольшая задержка, чтобы iframe успел инициализироваться в DOM
      const timer = setTimeout(() => {
        formRef.current?.submit();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, threeDSData]);

  return (
    <div
      className="grid lg:grid-cols-12 gap-8 sm:py-10 xsm:mb-2 sm:mb-8
      scale-[0.85] 2xsm:scale-[0.9] xsm:scale-[0.95] sm:scale-100"
    >
      {/* ЛЕВАЯ ЧАСТЬ (8 колонок) */}
      <div
        className="lg:col-span-8 space-y-6 max-2xsm:-mt-40 max-xsm:-mt-20
          max-sm:-mt-8"
      >
        {/* ----------------- 1. Получатель и Адрес ----------------- */}
        <CheckoutSection
          title="1. Shipping Address"
          icon={<MapPin />}
          isCompleted={!!user?.address?.street}
        >
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
        </CheckoutSection>
        {/* ---------------------- 2. Доставка ---------------------- */}

        <CheckoutSection
          title="2. Delivery Method"
          icon={<Truck />}
          isCompleted
        >
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
        <bankCardForm.Subscribe
          selector={(state) => state.canSubmit}
          children={(canSubmit) => (
            <CheckoutSection
              title="3. Payment Method"
              icon={<CreditCard />}
              isCompleted={paymentMethod === "card" ? canSubmit : true}
              // Теперь маркер "Done" будет загораться мгновенно
            >
              <PaymentMethodToggle
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />

              {paymentMethod === "card" && (
                <div className="mt-6">
                  <BankCardWithAnimation
                    // onSubmitData={CardDataHandler}
                    bankCardForm={bankCardForm}
                  />
                </div>
              )}
              {paymentMethod === "sbp" && (
                <div
                  className="mt-6 p-6 bg-gray-50 rounded-xl text-center
                    border-2 border-dashed"
                >
                  <Zap className="mx-auto mb-2 text-myMainColor" />
                  <p className="text-sm text-gray-600">
                    QR-code will be generated after clicking "Pay"
                  </p>
                </div>
              )}
            </CheckoutSection>
          )}
        />

        {/* ---------- 4. Обзор товаров (Компактный список) ---------- */}
        <CheckoutSection title="4. Review Items" icon={<PackageSearch />}>
          <div className="space-y-1">
            {items.map((item) => (
              <MiniCartItem key={item.id} cartItem={item} />
            ))}
          </div>

          {/* Ссылка "Вернуться к редактированию" на случай, если юзер передумал */}
          <Link
            from="/"
            to={`cart/${cartCode}`}
            className="text-xs text-primaryDark/50 hover:underline mt-4
              inline-block"
          >
            Edit order in cart
          </Link>
        </CheckoutSection>
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
          {/* ---------------------------------------------------------- */}
          <bankCardForm.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => {
              // Вычисляем готовность внутри подписки
              const isPaymentReady =
                paymentMethod === "card" ? canSubmit : true;
              const canPay = isAddressReady && isPaymentReady && !isLoading;

              return (
                <button
                  type="button"
                  disabled={!canPay || isSubmitting}
                  onClick={() => bankCardForm.handleSubmit()}
                  className="w-full mt-8 bg-primaryDarker text-primaryLighter
                    h-auto p-3 rounded-xl transition-transform cursor-pointer
                    text-sm xsm:text-base sm:text-lg lg:text-base xl:text-lg
                    border-2 border-primaryDark transition-all duration-300
                    active:hover:bg-primary hover:scale-105
                    disabled:hover:scale-100 disabled:opacity-50
                    disabled:cursor-not-allowed disabled:text-primary
                    drop-shadow-[5px_5px_5px_rgba(0,0,0,0.5)]
                    dark:shadow-[5px_5px_5px_rgba(255,255,255,0.5)]"
                >
                  {isSubmitting ? (
                    // <Loader className="animate-spin mx-auto" />
                    <PaymentLoader />
                  ) : (
                    <>
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
                    </>
                  )}
                </button>
              );
            }}
          </bankCardForm.Subscribe>

          {/* ---------------------------------------------------------- */}

          {delivery.id === "pickup" &&
            paymentMethod === "card" &&
            !user?.address?.street && (
              <div
                className="mt-10 p-4 bg-blue-50 rounded-lg text-xs
                text-blue-700"
              >
                ℹ️ Для оплаты картой при самовывозе укажите ваши данные как
                плательщика.
              </div>
            )}
        </div>
      </div>
      {/* {bankCardForm.state.isSubmitting && <PaymentLoader />} */}
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} iframe>
        <form
          method="POST"
          target="3ds-frame"
          ref={formRef}
          action={threeDSData?.acsUrl}
        >
          <input type="hidden" name="PaReq" value={threeDSData?.paReq} />
          <input
            type="hidden"
            name="TransactionId"
            value={threeDSData?.transactionId}
          />
          <input
            type="hidden"
            name="TermUrl"
            value={`${BASE_URL} + URL_ОБРАБОТЧИКА_3DS `}
          />
        </form>
      </Modal>
    </div>
  );
}
