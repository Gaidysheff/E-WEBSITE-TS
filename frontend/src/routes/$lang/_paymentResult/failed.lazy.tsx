// Расширяем глобальный объект Window для TypeScript
declare global {
  interface Window {
    jivo_api?: {
      get_mode(): unknown;
      open: () => void;
      close: () => void;
      // show: () => void;
      // hide: () => void;
      setCustomData: (
        data: Array<{ key: string; value: string; label: string }>,
      ) => void;
      setContactInfo: (info: {
        name: string;
        email: string;
        phone?: string;
        description?: string;
      }) => void;
    };
  }
}

import { Link, createLazyFileRoute } from "@tanstack/react-router";

import { AlertTriangle } from "lucide-react";
import { env } from "@/lib/env";
import { useCart } from "@/store/CartContext.tsx";
import { useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useUser } from "@/store/UserContext.tsx";

export const Route = createLazyFileRoute("/$lang/_paymentResult/failed")({
  component: Failure,
});

export function Failure() {
  // Вытаскиваем LL (объект перевода) и locale (текущий активный язык)
  const { LL, locale } = useI18nContext();

  const { cartCode } = useCart();
  const { user } = useUser();

  const supportEmail = env.VITE_MY_EMAIL_TO_RECEIVE;
  // const emailSubject = encodeURIComponent("Заказ: Ошибка оплаты на сайте");

  // Динамически переводим тему письма, передавая объект с параметрами, который требует TS!
  const emailSubject = LL.failedPage.emailSubject({
    cartCode: cartCode || "—",
  });

  const emailBody = encodeURIComponent(
    `Здравствуйте!\n\nУ меня возникла ошибка при оплате заказа.\nКод корзины: ${cartCode}\nВремя: ${new Date().toLocaleString()}`,
  );

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | undefined;

    // Универсальная функция передачи данных
    const trySetJivoData = () => {
      if (window.jivo_api && typeof window.jivo_api.open === "function") {
        // @ts-ignore
        const chatMode = window.jivo_api.get_mode
          ? window.jivo_api.get_mode()
          : "online";

        if (chatMode === "online") {
          window.jivo_api.open();

          const clientName = user
            ? `${user.first_name} ${user.last_name}`.trim()
            : "";
          const clientEmail = user?.email || "";

          if (clientEmail || clientName) {
            window.jivo_api.setContactInfo({
              name: clientName || `Покупатель (${cartCode?.slice(0, 4)})`,
              email: clientEmail,
              phone: user?.phone || "",
              // phone: user?.address?.phone || "",
              description: `Сбой оплаты. Корзина: ${cartCode}`,
            });

            window.jivo_api.setCustomData([
              {
                key: "cart_code",
                value: cartCode || "—",
                label: "Код корзины с ошибкой",
              },
              {
                key: "error_time",
                value: new Date().toLocaleTimeString(),
                label: "Время сбоя",
              },
            ]);
          }
        }
      } else {
        // Записываем таймер в переменную
        timerId = setTimeout(trySetJivoData, 200);
      }
    };

    trySetJivoData();

    return () => {
      // Очищаем таймер при размонтировании
      if (timerId) clearTimeout(timerId);

      if (window.jivo_api && typeof window.jivo_api.close === "function") {
        window.jivo_api.close();
      }
    };
  }, [cartCode, user]);
  // Добавьте user в зависимости, если будете использовать данные профиля

  return (
    <section
      className="bg-gradient-to-br from-red-50 to-red-100 px-6 py-20
      text-center h-screen flex items-center"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full shadow-inner">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <h1
          className="text-4xl md:text-5xl font-semibold text-red-900
          leading-snug"
        >
          {LL.failedPage.title()}
          {/* Oops! Payment Failed. */}
        </h1>
        <p className="text-lg md:text-xl text-red-800 max-w-2xl mx-auto">
          {LL.failedPage.description()}
          {/* Something went wrong while processing your payment. Do't worry - your
          order hasn't been charged. */}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <div className="flex flex-col">
            <span className="h-10"></span>
            <Link
              to={`/cart/${cartCode}`}
              params={{
                lang: locale,
                // Используем locale из useI18nContext(), чтобы сохранить текущий язык
                cartCode: cartCode,
              }}
              className="flex items-center justify-center h-12 my-auto px-6 
              rounded-full bg-red-700 text-white text-base font-medium
              hover:bg-red-800 transition duration-300"
            >
              {LL.failedPage.tryAgain()}
              {/* Try Again */}
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <p> {LL.failedPage.contactUs()}</p>
            <Link
              to="https://wa.me"
              // to="https://t.me"
              className="inline-block px-6 py-3 rounded-full bg-black
              text-white text-base font-medium hover:bg-red-800
              transition duration-300"
            >
              {LL.failedPage.contactSupportWa()}
              {/* Contact Support - WhatsApp */}
            </Link>

            <Link
              to={`mailto:${supportEmail}?subject=${emailSubject}&body=${emailBody}`}
              className="inline-block px-6 py-3 rounded-full bg-black
              text-white text-base font-medium hover:bg-red-800
              transition duration-300"
            >
              {LL.failedPage.contactSupportEmail()}
              {/* Contact Support - Email */}
            </Link>

            {/* Кнопка ручного открытия чата, если пользователь его случайно закрыл */}
            <button
              type="button"
              className="inline-block px-6 py-3 rounded-full bg-black text-white
              text-base font-medium hover:bg-red-800 transition duration-300"
              onClick={() => window.jivo_api?.open()}
            >
              {LL.failedPage.chatWithSupport()}
              {/* Chat with Support */}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
