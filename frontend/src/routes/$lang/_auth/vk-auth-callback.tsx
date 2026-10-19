import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { publicApi } from "@/api/api.ts";
import { toast } from "react-toastify";
import { useUser } from "@/store/UserContext";

export const Route = createFileRoute("/$lang/_auth/vk-auth-callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) || undefined,
    state: (search.state as string) || undefined,
    // Сюда прилетит 'vkid_vkid', 'vkid_mail_ru' или 'vkid_ok_ru'
    device_id: (search.device_id as string) || undefined,
    // Читаем device_id из URL!
  }),
  component: VKAuthCallbackPage,
});

function VKAuthCallbackPage() {
  const { code, state, device_id } = Route.useSearch();
  const { refreshUser } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  // Железный замок.
  // Ограничиваем выполнение строго одним разом за всю жизнь компонента
  const effectTriggered = useRef(false);

  useEffect(() => {
    // Если запрос УЖЕ улетел — немедленно блокируем любые повторные попытки ререндера!
    if (effectTriggered.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const exactCode = urlParams.get("code") || code;
    const exactState = urlParams.get("state") || state;
    const exactDeviceId = urlParams.get("device_id") || device_id;

    if (!exactCode) {
      setStatus("error");
      toast.error("Код авторизации VK не найден");
      return;
    }

    // Закрываем замок СИНХРОННО на первой же строчке до запуска async/await!
    effectTriggered.current = true;

    const exchangeCode = async () => {
      try {
        // console.log("[VK OAUTH] Отправляем чистый код:", exactCode);

        const response = await publicApi.post("/api/users/vk-login/", {
          code: exactCode,
          state: exactState,
          device_id: exactDeviceId,
        });

        if (response.data?.token) {
          // Сохраняем Knox токен
          localStorage.setItem("Token", response.data.token);

          // Обновляем контекст пользователя
          await refreshUser();

          toast.success("Успешный вход через VK ID!");
          navigate({ to: "/$lang/profile" });
        } else {
          // Если бэкенд вернул дубликат или пустой ответ
          throw new Error("Не удалось получить токен");
        }
      } catch (error) {
        console.error("Ошибка VK авторизации бэкенда:", error);
        setStatus("error");
        toast.error("Ошибка при обмене токенов VK ID");
        // В случае реального сетевого сбоя (например, таймаут) приоткрываем замок
        effectTriggered.current = false;
      }
    };

    exchangeCode();
  }, [code, state, device_id, navigate, refreshUser]);

  return (
    <section
      className="py-30 text-center h-screen flex items-center 
      justify-center bg-gray-50"
    >
      <div className="max-w-md mx-auto space-y-6">
        {status === "loading" ? (
          <>
            <Spinner className="size-16 text-myMainColor mx-auto" />
            <h2 className="text-xl font-semibold text-gray-700">
              Авторизация в магазине через VK ID
            </h2>
            <p className="text-sm text-gray-400">
              Связываем профили экосистемы...
            </p>
          </>
        ) : (
          <div
            className="bg-white p-8 rounded-lg shadow-sm
            border border-red-100"
          >
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Ошибка входа VK ID
            </h2>
            <button
              onClick={() => navigate({ to: "/$lang/login" })}
              className="mt-4 px-4 py-2 bg-myMainColor text-white rounded-sm"
            >
              Вернуться назад
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
