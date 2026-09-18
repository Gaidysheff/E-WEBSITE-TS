import { useEffect, useRef, useState } from "react";

import { AlertTriangle } from "lucide-react";
import Confetti from "react-confetti";
import { Spinner } from "@/components/ui/spinner";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useI18nContext } from "@/i18n/i18n-react";
import useWindowSize from "react-use/lib/useWindowSize";
import { verifySubscription } from "@/api/actions";

export const Route = createLazyFileRoute(
  "/$lang/_mainLayout/news/verify_subscription/$token",
)({
  component: VerifySubscriptionPage,
});

function VerifySubscriptionPage() {
  const { token } = Route.useParams();
  const { LL } = useI18nContext();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const initialized = useRef(false); // Замок от двойного вызова в React 18 Strict Mode

  const { width, height } = useWindowSize();

  const [windowSize, setWindowSize] = useState({
    width,
    height,
  });

  const handleWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const confirmSubscription = async () => {
    try {
      // Шлём POST-запрос на Beget
      await verifySubscription(token);
      setStatus("success");
    } catch (error) {
      console.error("Ошибка верификации подписки:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    // Если эффект уже выполнялся — игнорируем второй вызов
    if (initialized.current) return;
    initialized.current = true;

    confirmSubscription();

    window.onresize = () => handleWindowSize();
    // Имитируем небольшую задержку для красоты или ждем данных
    // const timer = setTimeout(() => {}, 800);
    // return () => clearTimeout(timer);
  }, [token]);

  return (
    <section className="text-center">
      {status === "loading" && (
        <div
          className="bg-gradient-to-br from-amber-50 to-amber-100 h-screen
    flex items-center sm:-mt-60"
        >
          <div className="container max-w-md mx-auto px-4">
            <div className="space-y-4">
              <Spinner className="size-12 text-amber-500 mx-auto" />
              <p className="text-lg text-amber-800">
                {/* Активация вашей подписки... */}
                {LL.newsApplication.subscribeConfirming()}
                {/* Подтверждаем подписку на новости... */}
              </p>
            </div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div
          className="bg-gradient-to-br from-green-50 to-green-100 h-screen
          flex items-center sm:-mt-60"
        >
          <div className="container max-w-md mx-auto px-4">
            <div className="border border-green-200 bg-green-50 p-6 rounded-lg shadow-sm">
              <Confetti width={windowSize.width} height={windowSize.height} />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                🎉 {LL.newsApplication.subscribeSuccessTittle()}
                {/* Успешно! */}
              </h2>
              <p className="text-gray-700">
                {LL.newsApplication.subscribeSuccessText()}
                {/* Спасибо! Ваша подписка успешно подтверждена. Теперь вы будете
            первыми получать наши свежие статьи и события. */}
              </p>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          className="bg-gradient-to-br from-red-50 to-red-100 h-screen
          flex items-center sm:-mt-60"
        >
          <div className="container max-w-md mx-auto px-4">
            <div className="flex justify-center">
              <div className="bg-red-100 p-4 rounded-full shadow-inner">
                <AlertTriangle className="w-20 h-20 text-red-600" />
              </div>
            </div>
            <div className="border border-red-200 bg-red-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-red-700 mb-2">
                ❌ {LL.newsApplication.subscribeErrorTittle()}
                {/* Ошибка активации */}
              </h2>
              <p className="text-gray-700">
                {LL.newsApplication.subscribeErrorText()}
                {/* Эта ссылка больше недействительна. Возможно, подписка уже была
            подтверждена ранее или токен устарел. */}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
