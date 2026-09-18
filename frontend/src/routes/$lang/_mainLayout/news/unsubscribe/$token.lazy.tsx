import { useEffect, useRef, useState } from "react";

import { AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { createLazyFileRoute } from "@tanstack/react-router";
import { unsubscribeAction } from "@/api/actions";
import { useI18nContext } from "@/i18n/i18n-react";

export const Route = createLazyFileRoute(
  "/$lang/_mainLayout/news/unsubscribe/$token",
)({
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const { token } = Route.useParams(); // Получаем токен из URL

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const { LL } = useI18nContext();

  const initialized = useRef(false); // "Замок"

  useEffect(() => {
    if (initialized.current) return; // Если уже запускали — выходим
    initialized.current = true;

    const confirm = async () => {
      try {
        await unsubscribeAction(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    confirm();
  }, [token]);

  return (
    <div>
      {status === "loading" && (
        <section
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 px-6 py-20
    text-center h-screen flex items-center"
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <Spinner className="size-50 text-myMainColor mx-auto" />
            <h1 className="font-semibold text-myMainColor leading-snug">
              <p className="text-2xl md:text-4xl">
                {LL.newsApplication.unSubscribeConfirming()}
                {/* Идёт процесс отмены Вашей подписки ... */}
              </p>
            </h1>
          </div>
        </section>
      )}

      {/* ------------------- Результат "УДАЧА" ------------------- */}

      {status === "success" && (
        <section
          className="bg-gradient-to-br from-green-50 to-green-100 px-6 py-20
          text-center h-screen flex items-center"
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <h1
              className="text-2xl xsm:text-3xl sm:text-4xl md:text-5xl
              font-semibold text-green-900 leading-snug"
            >
              {LL.newsApplication.unSubscribeSuccessTittle()}
              {/* 🎉 Ваша подписка успешно отменена! */}
            </h1>
            <h1
              className="text-xl xsm:text-2xl sm:text-3xl md:text-4xl
              font-semibold text-green-900 leading-snug"
            >
              {LL.newsApplication.unSubscribeSuccessSubTittle()}
              {/* Вы больше не будете получать наши информационные письма. */}
            </h1>
            <h1
              className="text-xl xsm:text-2xl sm:text-3xl md:text-4xl
              font-semibold text-green-900 leading-snug"
            >
              {LL.newsApplication.unSubscribeSuccessText()}
              {/* Если Вы передумаете, Вы можете заново подписаться в любое удобное время. */}
            </h1>
          </div>
        </section>
      )}

      {/* ------------------- Результат "ОШИБКА" ------------------- */}

      {status === "error" && (
        <section
          className="bg-gradient-to-br from-red-50 to-red-100 px-6 py-20
    text-center h-screen flex items-center"
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex justify-center">
              <div className="bg-red-100 p-4 rounded-full shadow-inner">
                <AlertTriangle className="w-50 h-50 text-red-600" />
              </div>
            </div>
            <h1 className="font-semibold text-red-900 leading-snug">
              <p className="text-5xl md:text-8xl">
                {LL.newsApplication.unSubscribeErrorTittle()}
                {/* Ошибка! */}
              </p>
              <p className="text-3xl md:text-5xl">
                {LL.newsApplication.unSubscribeErrorSubTittle()}
                {/* Ваша подписка не отменена. */}
              </p>
              <p className="text-2xl md:text-4xl">
                {LL.newsApplication.unSubscribeErrorText()}
                {/* Токен недействителен или срок его действия истёк. */}
              </p>
            </h1>
          </div>
        </section>
      )}
    </div>
  );
}
