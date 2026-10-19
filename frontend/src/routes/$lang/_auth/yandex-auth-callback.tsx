import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { publicApi } from "@/api/api.ts";
import { toast } from "react-toastify";
import { useUser } from "@/store/UserContext";

export const Route = createFileRoute("/$lang/_auth/yandex-auth-callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) || undefined,
  }),

  component: YandexAuthCallbackPage,
});

function YandexAuthCallbackPage() {
  const { code } = Route.useSearch();

  const { refreshUser } = useUser();

  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "error">("loading");

  const initialized = useRef(false);
  // Наш верный "замок" от двойного Strict-Mode вызова

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
        // ("[OAUTH FRONTEND] Отправляем точный код на бэкенд:", code);

        // Шлём POST на наш Django бэкенд, передавая code
        const response = await publicApi.post("/api/users/yandex-login/", {
          code,
        });
        // const response = await publicApi.post(
        //   `${BASE_URL}/api/users/yandex-login/`, {code,},
        // );

        if (response.data?.token) {
          // Записываем наш стандартный Knox токен в LocalStorage!
          localStorage.setItem("Token", response.data.token);

          await refreshUser();

          toast.success("Успешный вход через Yandex ID!");

          // Перенаправляем пользователя в его личный профиль
          navigate({ to: "/$lang/profile" });
        } else {
          throw new Error("Токен не получен");
        }
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
            <Spinner className="size-16 text-myMainColor mx-auto" />
            <h2 className="text-xl font-semibold text-gray-700">
              Авторизация в магазине через Yandex ID...
            </h2>
            <p className="text-sm text-gray-400">
              Пожалуйста, подождите, мы настраиваем ваш профиль.
            </p>
          </>
        ) : (
          <div
            className="bg-white p-8 rounded-lg shadow-sm
            border border-red-100"
          >
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Ошибка входа
            </h2>
            <p className="text-gray-600 mb-6">
              Произошла ошибка при обмене данными с сервером авторизации.
            </p>
            <button
              onClick={() => navigate({ to: "/$lang/login" })}
              className="px-4 py-2 bg-primary text-white rounded-sm
              hover:scale-105 transition-all cursor-pointer"
            >
              Вернуться на страницу входа
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
