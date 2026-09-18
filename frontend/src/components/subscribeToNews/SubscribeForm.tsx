import { useUser } from "@/store/UserContext.tsx";
import { z } from "zod";
import { type Dispatch, type SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import { subscribeToNews } from "@/api/actions";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils.ts";
import { useI18nContext } from "@/i18n/i18n-react";
import { useForm } from "@tanstack/react-form";

interface Props {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  // setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // setIsModalOpen: (open: boolean) => void;
}

export const subscribeSchema = z.object({
  email: z
    .string() // — базовый тип.
    .min(1, { message: "auth.mustField" })
    // .min(1, { message: "Поле обязательно" })
    // — чтобы поймать пустую строку до сложной проверки форма
    .pipe(
      z
        // .email({ message: "auth.emailInvalid" })
        .email("auth.emailInvalid")
        // .email("Некорректный email")
        // .min(5, "Слишком короткий email") не работает,
        // так как поглащается самой валидацией .email
        .max(254, {
          message: "auth.tooLong",
          // message: "Email слишком длинный (RFC допускает до 254 символов)",
        })
        .transform((val) => val.toLowerCase()),
    ),
});

// type SubscribeFormType = z.infer<typeof subscribeSchema>;

const SubscribeForm = ({ setIsModalOpen }: Props) => {
  const { LL } = useI18nContext();

  const { user } = useUser();

  // Мутация TanStack Query
  const { mutate, isPending } = useMutation({
    mutationFn: subscribeToNews,
    onSuccess: (data) => {
      toast.success(
        data.message || `${LL.newsApplication.subscibeForm.success()}`,
      );
      // toast.success(data.message || "Письмо для подтверждения отправлено!");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      // Если Django вернул ошибку "Вы уже подписаны"
      const errorMessage =
        error.response?.data?.detail ||
        `${LL.newsApplication.subscibeForm.error()}`;
      // error.response?.data?.detail || "Ошибка при подписке";
      toast.error(errorMessage);
    },
  });

  // 2. Инициализируем управление формой через TanStack Form
  const form = useForm({
    defaultValues: {
      // Если пользователь залогинен — подставляем его email, иначе пустая строка
      email: user?.email || "",
    },
    onSubmit: async ({ value }) => {
      // Прогоняем данные через нашу Zod-схему (pipe + точное lowercase-приведение)
      const result = subscribeSchema.safeParse(value);

      if (result.success) {
        // Отправляем очищенные данные в мутацию
        mutate(result.data);
      } else {
        // Если Zod нашёл ошибку до отправки на сервер
        const firstError = result.error.issues[0]?.message || "Invalid email";
        toast.error(firstError);
      }
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
      bg-black/50 backdrop-blur-sm"
    >
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl 
        border border-gray-100"
      >
        <h3 className="text-2xl font-bold mb-2">
          {LL.newsApplication.subscibeForm.title()}
          {/* Подписка на новости */}
        </h3>
        <p className="text-gray-500 mb-6 text-sm">
          {LL.newsApplication.subscibeForm.subtitle()}
          {/* Получайте самые свежие статьи, события и персональные предложения
нашего магазина. */}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
            // const formData = new FormData(e.currentTarget);
            // const emailValue = formData.get("email") as string;

            // // Валидируем через Zod перед отправкой
            // const result = subscribeSchema.safeParse({ email: emailValue });

            // if (result.success) {
            //   mutate(result.data); // Отправляем трансформированный email (в нижнем регистре)
            // } else {
            //   toast.error(result.error.issues[0].message);
            // }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {LL.newsApplication.subscibeForm.label()}
              {/* Email адрес */}
            </label>

            {/* Используем встроенный Field контроллер от вашей библиотеки форм */}
            <form.Field
              name="email"
              children={(field) => (
                <>
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    // Если пользователь авторизован — блокируем поле, так как его email уже проверен в БД
                    disabled={!!user?.email}
                    className={cn(
                      "w-full border border-primary rounded-sm p-2 text-base outline-none focus:border-primary/80 transition-all",
                      user?.email &&
                        "bg-gray-100 cursor-not-allowed text-gray-500 border-gray-300",
                    )}
                    placeholder="example@domain.com"
                  />
                  {field.state.meta.errors ? (
                    <em className="text-xs text-red-500 mt-1 block">
                      {field.state.meta.errors.join(", ")}
                    </em>
                  ) : null}
                </>
              )}
            />
            {/* <input
              type="email"
              name="email"
              // Автоподстановка: если юзер залогинен, жестко ставим его почту
              defaultValue={user?.email || ""}
              disabled={!!user?.email} // Блокируем инпут, если email из БД
              className={cn(
                "w-full border border-gray-300 rounded-md p-2 text-base outline-none focus:border-primary transition-all",
                user?.email && "bg-gray-100 cursor-not-allowed text-gray-500",
              )}
              placeholder="example@domain.com"
              required
            /> */}
          </div>

          {/* Выводим предупреждение для авторизованных пользователей */}
          {user?.email && (
            <p className="text-xs text-gray-400 italic mt-1">
              {LL.newsApplication.subscibeForm.note()}
              {/* * Будет использован email вашего аккаунта */}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 rounded-md
              hover:bg-gray-50 transition-all cursor-pointer"
            >
              {LL.newsApplication.subscibeForm.cancel()}
              {/* Отмена */}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-primary text-white rounded-md
              hover:scale-105 active:scale-95 transition-all cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? `${LL.newsApplication.subscibeForm.sending()}`
                : `${LL.newsApplication.subscibeForm.subscibe()}`}
              {/* {isPending ? "Отправка..." : "Подписаться"} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscribeForm;
