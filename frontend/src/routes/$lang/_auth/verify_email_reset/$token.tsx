import { useEffect, useRef, useState } from "react";

import { AlertTriangle } from "lucide-react";
import Confetti from "react-confetti";
import { AppLink as Link } from "@/components/appLink/AppLink";
import { LogIn } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";
import { useI18nContext } from "@/i18n/i18n-react";
import useWindowSize from "react-use/lib/useWindowSize";
import { verifyNewEmail } from "@/api/endpoints_auth";

export const Route = createFileRoute("/$lang/_auth/verify_email_reset/$token")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
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
        console.log("🚀 ~ VerifyEmailPage ~ token:", token);
        await verifyNewEmail(token);
        setStatus("success");
        // Только ПОСЛЕ этого момента можно обновить setUser или попросить перевойти
      } catch (err) {
        // Проверяем, не была ли это ошибка 404 при уже измененном email
        setStatus("error");
      }
    };
    confirm();
  }, [token]);

  // -------------------------------------------------------------------

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

  useEffect(() => {
    window.onresize = () => handleWindowSize();
  }, []);

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
                {LL.profile.emailChange.verification.loading()}
                {/* Процесс подтверждения изменения Вашего нового адреса электронной почты ... */}
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
          <Confetti width={windowSize.width} height={windowSize.height} />

          <div className="max-w-3xl mx-auto space-y-8">
            <h1
              className="text-2xl xsm:text-3xl sm:text-4xl md:text-5xl
              font-semibold text-green-900 leading-snug"
            >
              {LL.profile.emailChange.verification.success()}
              {/* 🎉 Адрес электронной почты успешно изменен! */}
            </h1>
            <h1
              className="text-xl xsm:text-2xl sm:text-3xl md:text-4xl
              font-semibold text-green-900 leading-snug"
            >
              {LL.profile.emailChange.verification.loginAgain()}
              {/* Пожалуйста, авторизуйтесь заново, используя теперь новый адрес электронной почты. */}
            </h1>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                to="/$lang/login"
                className="flex items-center gap-5 px-6 py-3 rounded-full
                bg-green-700 text-white text-3xl hover:bg-green-800 mx-auto
                transition duration-300"
              >
                <LogIn size={40} />
                {LL.profile.emailChange.verification.login()}
                {/* Login */}
              </Link>
            </div>
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
                {LL.profile.emailChange.verification.error()}
                {/* Ошибка! */}
              </p>
              <p className="text-2xl md:text-4xl">
                {LL.profile.emailChange.verification.noToken()}
                {/* Токен недействителен или срок его действия истек. */}
              </p>
            </h1>
          </div>
        </section>
      )}
    </div>
  );
}
