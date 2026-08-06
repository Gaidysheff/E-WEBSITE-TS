import { useEffect, useState } from "react";

import Confetti from "react-confetti";
import { AppLink as Link } from "@/components/appLink/AppLink";
import SuccessSkeleton from "@/components/paymentResult/SuccessSkeleton.tsx";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useCart } from "@/store/CartContext.tsx";
import { useI18nContext } from "@/i18n/i18n-react";
import useWindowSize from "react-use/lib/useWindowSize";

export const Route = createLazyFileRoute("/$lang/_paymentResult/success")({
  component: Success,
});

export function Success() {
  const { LL } = useI18nContext();

  const [loading, setLoading] = useState<boolean>(true);

  const { orderId, cryptogram } = Route.useSearch() as {
    orderId?: string;
    cryptogram?: string;
  };

  // const { clearCart } = useCart();

  const { clearCartAfterOrder } = useCart();

  // const { width, height } = useWindowSize();
  // const [showConfetti, setShowConfetti] = useState(false);

  // useEffect(() => {
  //   // Запускаем через 100мс после загрузки страницы
  //   const timer = setTimeout(() => setShowConfetti(true), 100);
  //   return () => clearTimeout(timer);
  // }, []);

  const { width, height } = useWindowSize();

  const [windowSize, setWindowSize] = useState({
    // width: 0,
    // height: 0,

    width,
    height,
  });

  const handleWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    // Корзина очистится один раз, когда страница успеха полностью отрендерится

    clearCartAfterOrder();

    // clearCart();

    window.onresize = () => handleWindowSize();
    // Имитируем небольшую задержку для красоты или ждем данных
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SuccessSkeleton />;

  return (
    <section
      className="bg-gradient-to-br from-green-50 to-green-100 px-6 py-20
      text-center h-screen flex items-center"
    >
      {/* {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false} // Чтобы не сыпало бесконечно
          numberOfPieces={500}
        />
      )} */}
      <Confetti width={windowSize.width} height={windowSize.height} />

      <div className="max-w-3xl mx-auto space-y-8">
        <h1
          className="text-2xl xsm:text-3xl sm:text-4xl md:text-5xl
          font-semibold text-green-900 leading-snug"
        >
          {LL.successPage.thanx()}
          {/* 🎉 Thank You for Your Purchase! */}
        </h1>

        {/* ================ Эмуляция ===================== */}
        <div className="bg-green-900 text-white">
          <h2 className="text-xl pb-5">
            {LL.successPage.signTestOne()}
            {/* Эта надпись показана только в тестовом режиме */}
          </h2>
          <p className="py-3">
            {LL.successPage.signTestTwo()}
            {/* С сервера-эквайринга была получена криптограмма, платёжные данные
  были зашифрованы и переданы на сервер. */}
          </p>
          <p className="break-all text-sm">{cryptogram}</p>
        </div>
        {/* ================================================== */}

        <p className="text-lg md:text-xl text-green-800 max-w-2xl mx-auto">
          {LL.successPage.order()}
          {/* Your order */}
        </p>
        <p className="text-gray-500">
          {LL.successPage.orderNo()} {/* Order number:{" "} */}
          <span
            className="font-bold text-primaryDark text-sm 2xsm:text-lg
          xsm:text-xl sm:text-2xl"
          >
            #{orderId}
          </span>
        </p>
        <p className="text-lg md:text-xl text-green-800 max-w-2xl mx-auto">
          {LL.successPage.messageSuccess()}
          {/* was placed successfully! We truly appreciate your business and will
          send you updates once your order ships. */}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/$lang/profile"
            className="inline-block px-6 py-3 rounded-full bg-green-700
            text-white text-base font-medium hover:bg-green-800
            transition duration-300"
          >
            {LL.successPage.orderView()}
            {/* View Order */}
          </Link>
          <Link
            to="/$lang/"
            className="inline-block px-6 py-3 rounded-full bg-black
            text-white text-base font-medium hover:bg-green-800
            transition duration-300"
          >
            {LL.successPage.continue()}
            {/* Continue Shopping */}
          </Link>
        </div>
      </div>
    </section>
  );
}
