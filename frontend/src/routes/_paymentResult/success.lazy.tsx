import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import Confetti from "react-confetti";
import SuccessSkeleton from "@/components/paymentResult/SuccessSkeleton.tsx";
import useWindowSize from "react-use/lib/useWindowSize";

export const Route = createLazyFileRoute("/_paymentResult/success")({
  component: Success,
});

export function Success() {
  const [loading, setLoading] = useState<boolean>(true);

  const { orderId, cryptogram } = Route.useSearch() as {
    orderId?: string;
    cryptogram?: string;
  };

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
    window.onresize = () => handleWindowSize();
  }, []);

  useEffect(() => {
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
          🎉 Thank You for Your Purchase!
        </h1>

        {/* ================ Эмуляция ===================== */}
        <div className="bg-green-900 text-white">
          <h2 className="text-xl pb-5">
            Эта секция показана только в тестовом режиме
          </h2>
          <p className="py-3">
            С сервера-эквайринга была получена криптограмма, платёжные данные
            были зашифрованы и переданы на сервер.
          </p>
          <p className="break-all text-sm">{cryptogram}</p>
        </div>
        {/* ================================================== */}

        <p className="text-lg md:text-xl text-green-800 max-w-2xl mx-auto">
          Your order
        </p>
        <p className="text-gray-500">
          Order number:{" "}
          <span
            className="font-bold text-primaryDark text-sm 2xsm:text-lg
          xsm:text-xl sm:text-2xl"
          >
            #{orderId}
          </span>
        </p>
        <p className="text-lg md:text-xl text-green-800 max-w-2xl mx-auto">
          was placed successfully! We truly appreciate your business and will
          send you updates once your order ships.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/profile"
            className="inline-block px-6 py-3 rounded-full bg-green-700
            text-white text-base font-medium hover:bg-green-800
            transition duration-300"
          >
            View Order
          </Link>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-full bg-black
            text-white text-base font-medium hover:bg-green-800
            transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
