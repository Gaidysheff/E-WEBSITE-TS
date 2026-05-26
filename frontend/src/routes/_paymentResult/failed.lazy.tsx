// Расширяем глобальный объект Window для TypeScript
declare global {
  interface Window {
    jivo_api?: {
      open: () => void;
      close: () => void;
      show: () => void;
      hide: () => void;
      setCustomData: (
        data: Array<{ key: string; value: string; label: string }>,
      ) => void;
      setContactInfo: (info: {
        name: string;
        email: string;
        phone?: string;
      }) => void;
    };
  }
}

import { Link, createLazyFileRoute } from "@tanstack/react-router";

import { AlertTriangle } from "lucide-react";
import { env } from "@/lib/env";
import { useCart } from "@/store/CartContext.tsx";
import { useEffect } from "react";
import { useUser } from "@/store/UserContext.tsx";

export const Route = createLazyFileRoute("/_paymentResult/failed")({
  component: Failure,
});

export function Failure() {
  const { cartCode } = useCart();
  const { user } = useUser();

  const supportEmail = env.VITE_MY_EMAIL_TO_RECEIVE;
  const emailSubject = encodeURIComponent("Заказ: Ошибка оплаты на сайте");
  const emailBody = encodeURIComponent(
    `Здравствуйте!\n\nУ меня возникла ошибка при оплате заказа.\nКод корзины: ${cartCode}\nВремя: ${new Date().toLocaleString()}`,
  );

  useEffect(() => {
    // 1. Проверяем, загрузился ли скрипт Jivo в глобальное окно браузера
    // @ts-ignore
    if (window.jivo_api) {
      window.jivo_api.show(); // Показываем ярлык чата
      window.jivo_api.open(); // Автоматически раскрываем диалоговое окно

      // 2. Прокидываем данные клиента и контекст ошибки оператору поддержки
      // (Данные user возьмите из вашего контекста авторизации,
      // если они доступны на этой странице)
      let clientName = user ? `${user.first_name} ${user.last_name}` : "Гость";

      // Если имя и фамилия не заполнены в профиле, используем username или часть email
      if (!clientName && user) {
        clientName = user.username || user.email.split("@")[0];
      }

      const clientEmail = user?.email || "Не указан";

      // 1. ЖЕЛЕЗНО регистрируем контакты, чтобы чат не задавал вопросов пользователю
      if (clientEmail || clientName) {
        // Убедитесь, что добавили этот метод в declare global интерфейса Window сверху!
        window.jivo_api.setContactInfo({
          name: clientName,
          email: clientEmail,
          phone: user?.address?.phone || "",
        });
      }

      window.jivo_api.setCustomData([
        // { key: "client_name", value: clientName, label: "Имя клиента" },
        // { key: "client_email", value: clientEmail, label: "Email" },
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

    return () => {
      // Когда пользователь нажимает "Try Again" и уходит со страницы:
      // @ts-ignore
      if (window.jivo_api) {
        // @ts-ignore
        window.jivo_api.close(); // Сворачиваем окно чата
        // @ts-ignore
        window.jivo_api.hide(); // Полностью скрываем ярлык с сайта
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
          Oops! Payment Failed.
        </h1>
        <p className="text-lg md:text-xl text-red-800 max-w-2xl mx-auto">
          Something went wrong while processing your payment. Do't worry - your
          order hasn't been charged.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <div className="flex flex-col">
            <span className="h-10"></span>
            <Link
              to={`/cart/${cartCode}`}
              className="flex items-center justify-center h-12 my-auto px-6 
              rounded-full bg-red-700 text-white text-base font-medium
              hover:bg-red-800 transition duration-300"
            >
              Try Again
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <p>Contact us</p>
            <Link
              to="https://wa.me"
              // to="https://t.me"
              className="inline-block px-6 py-3 rounded-full bg-black
              text-white text-base font-medium hover:bg-red-800
              transition duration-300"
            >
              Contact Support - WhatsApp
            </Link>

            <Link
              to={`mailto:${supportEmail}?subject=${emailSubject}&body=${emailBody}`}
              className="inline-block px-6 py-3 rounded-full bg-black
              text-white text-base font-medium hover:bg-red-800
              transition duration-300"
            >
              Contact Support - Email
            </Link>

            {/* Кнопка ручного открытия чата, если пользователь его случайно закрыл */}
            <button
              type="button"
              className="inline-block px-6 py-3 rounded-full bg-black
  text-white text-base font-medium hover:bg-red-800
  transition duration-300"
              onClick={() => window.jivo_api?.open()}
            >
              Chat with Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
