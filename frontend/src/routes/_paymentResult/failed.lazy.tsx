import { Link, createLazyFileRoute } from "@tanstack/react-router";

import { AlertTriangle } from "lucide-react";
import { env } from "@/lib/env";
import { useCart } from "@/store/CartContext.tsx";

export const Route = createLazyFileRoute("/_paymentResult/failed")({
  component: Failure,
});

export function Failure() {
  const { cartCode } = useCart();

  const supportEmail = env.VITE_MY_EMAIL_TO_RECEIVE;
  const emailSubject = encodeURIComponent("Заказ: Ошибка оплаты на сайте");
  const emailBody = encodeURIComponent(
    `Здравствуйте!\n\nУ меня возникла ошибка при оплате заказа.\nКод корзины: ${cartCode}\nВремя: ${new Date().toLocaleString()}`,
  );

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
          Something went wrong while processing your payment/ Do't worry - your
          order hasn't been charged.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to={`/cart/${cartCode}`}
            className="inline-block px-6 py-3 rounded-full bg-red-700
            text-white text-base font-medium hover:bg-red-800
            transition duration-300"
          >
            Try Again
          </Link>
          <Link
            to="https://wa.me"
            // to="https://t.me"
            className="inline-block px-6 py-3 rounded-full bg-black
            text-white text-base font-medium hover:bg-red-800
            transition duration-300"
          >
            Contact Support - WA
          </Link>

          <Link
            to={`mailto:${supportEmail}?subject=${emailSubject}&body=${emailBody}`}
            className="inline-block px-6 py-3 rounded-full bg-black
            text-white text-base font-medium hover:bg-red-800
            transition duration-300"
          >
            Contact Support - Email
          </Link>
        </div>
      </div>
    </section>
  );
}
