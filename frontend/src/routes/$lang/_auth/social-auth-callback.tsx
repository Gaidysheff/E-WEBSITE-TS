import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import privateApi from "@/api/api.ts";
import { toast } from "react-toastify";
import { useI18nContext } from "@/i18n/i18n-react";
import { useUser } from "@/store/UserContext";

// import { useQueryClient } from "@tanstack/react-query"; // Импортируем клиент кэша

// import { publicApi } from "@/api/api.ts";

// Используем publicApi для OAuth

export const Route = createFileRoute("/$lang/_auth/social-auth-callback")({
  // 1. Валидируем параметры поисковой строки. Нам обязательно нужен 'code'
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) || undefined,
  }),
  component: SocialAuthCallbackPage,
});

function SocialAuthCallbackPage() {
  const { code } = Route.useSearch();
  // console.log("Временный код, полученный от Яндекса:", code);

  // const queryClient = useQueryClient(); // Инициализируем клиент в компоненте

  const { refreshUser } = useUser();

  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const initialized = useRef(false);
  // Наш верный "замок" от двойного Strict-Mode вызова

  const { LL } = useI18nContext();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!code) {
      setStatus("error");
      toast.error("Код авторизации не найден");
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        console.log("[OAUTH FRONTEND] Отправляем точный код на бэкенд:", code);

        // Шлём POST на наш Django бэкенд, передавая code
        const response = await privateApi.post("/api/users/yandex-login/", {
          code,
        });
        // const response = await publicApi.post(
        //   `${BASE_URL}/api/users/yandex-login/`, {code,},
        // );

        if (response.data?.token) {
          // Записываем наш стандартный Knox токен в LocalStorage!
          localStorage.setItem("Token", response.data.token);

          // КРИТИЧЕСКИЙ ФИКС: Жестко сбрасываем кэш пользователя!
          // Замените "user" или "profile" на тот точный queryKey,
          // # который используется в вашем хуке useUser() для чтения профиля
          // await queryClient.invalidateQueries({ queryKey: ["user"] });

          await refreshUser();

          toast.success("Успешный вход через Yandex ID!");

          // Перенаправляем пользователя в его личный профиль
          navigate({ to: "/$lang/profile" });
        } else {
          throw new Error("Токен не получен");
        }
        // } catch (error) {
        //   console.error("Ошибка социальной авторизации:", error);
        //   setStatus("error");
        //   toast.error("Не удалось войти через социальную сеть");
        // }
      } catch (error: any) {
        // Добавляем вывод тела ответа от нашего Django бэкенда
        if (error.response?.data) {
          console.log(
            "❌ ДЕТАЛЬНАЯ ОШИБКА ОТ ДЖАНГО/ЯНДЕКСА:",
            error.response.data,
          );
        } else {
          console.error("Ошибка социальной авторизации:", error);
        }
        setStatus("error");
        toast.error("Не удалось войти через социальную сеть");
      }
    };

    exchangeCodeForToken();
  }, [navigate, refreshUser]);

  return (
    <section
      className="py-30 text-center h-screen
      flex items-center justify-center bg-gray-50"
    >
      <div className="max-w-md mx-auto space-y-6">
        {status === "loading" ? (
          <>
            <h2 className="text-xl font-semibold text-gray-700">
              {LL.auth.socialAuthCallback.loadingTitle()}
              {/* Авторизация в магазине через YandexID */}
            </h2>
            <Spinner className="size-16 text-myMainColor mx-auto" />
            <p className="text-sm text-gray-400">
              {LL.auth.socialAuthCallback.loadingMessage()}
              {/* Пожалуйста, подождите, мы настраиваем ваш профиль. */}
            </p>
          </>
        ) : (
          <div
            className="bg-white p-8 rounded-lg shadow-sm
            border border-red-100"
          >
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              {LL.auth.socialAuthCallback.errorTitle()}
              {/* Ошибка входа */}
            </h2>
            <p className="text-gray-600 mb-6">
              {LL.auth.socialAuthCallback.errorMessage()}
              {/* Произошла ошибка при обмене данными с сервером авторизации. */}
            </p>
            <button
              onClick={() => navigate({ to: "/$lang/login" })}
              className="px-4 py-2 bg-primary text-white rounded-sm
              hover:scale-105 transition-all cursor-pointer"
            >
              {LL.auth.socialAuthCallback.returnBtn()}
              {/* Вернуться на страницу входа */}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
