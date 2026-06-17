import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { googleLoginAction, login } from "@/api/endpoints_auth";

import type { AnyFieldApi } from "@tanstack/react-form";
import { BASE_URL } from "@/api/api.ts";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLink as Link } from "@/components/appLink/AppLink";
import { MoveLeft } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/routes/$lang.tsx";
import { getZodTranslation } from "@/lib/i18nHelper.ts";
import { toast } from "react-toastify";
import { useCart } from "@/store/CartContext.tsx";
import { useForm } from "@tanstack/react-form";
import { useGoogleLogin } from "@react-oauth/google";
import { useI18nContext } from "@/i18n/i18n-react";
import { useUser } from "@/store/UserContext";
import { z } from "zod";

export const Route = createFileRoute("/$lang/_auth/login")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      // Регистрируем опциональный параметр redirect как строку
      // Всегда возвращаем объект, даже если он пустой
      redirect: (search.redirect as string) || undefined,
    };
  },
  component: Login,
});

const LoginSchema = z.object({
  email: z.email("auth.emailInvalid"), // Зашиваем путь к ключу в словаре
  password: z.string().min(4, "auth.passwordMin"),

  // email: z.email(),
  // password: z.string().min(4, "Password must be at least 4 characters"),
});

type Login = z.infer<typeof LoginSchema>;

function FieldInfo({ field }: { field: AnyFieldApi }) {
  const { LL } = useI18nContext();

  // Весь этот функционал переведен в файл src/lib/i18nHelper.ts
  // ------------------------------------------------------------------
  // Функция динамического чтения глубоких ключей (например, "auth.passwordMin") из LL
  // const getTranslatedMessage = (errorKey: string) => {
  //   try {
  //     const parts = errorKey.split("."); // Разделяем "auth" и "passwordMin"
  //     let currentObj: any = LL;

  //     for (const part of parts) {
  //       if (currentObj && part in currentObj) {
  //         currentObj = currentObj[part];
  //       } else {
  //         return errorKey; // Если ключ не найден в словаре, вернем исходный текст Zod
  //       }
  //     }

  //     // typesafe-i18n хранит конечные переводы как функции, вызываем её
  //     return typeof currentObj === "function" ? currentObj() : errorKey;
  //   } catch {
  //     return errorKey;
  //   }
  // };

  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={
            field.state.meta.errors.length
              ? "text-destructive text-sm not-italic"
              : ""
          }
        >
          {
            field.state.meta.errors.map((err) => {
              // Если ошибка прилетела от Zod (строка содержит точку), переводим её
              const errMsg = err?.message || String(err);
              return errMsg.includes(".")
                ? // ? getTranslatedMessage(errMsg)
                  getZodTranslation(errMsg, LL)
                : errMsg;
            })[0]
            // .join(", ")
          }
        </em>
      ) : null}

      {/* Мгновенный перевод статуса проверки */}
      {field.state.meta.isValidating ? (
        <span className="text-gray-400 text-sm">{LL.auth.validating()}</span>
      ) : null}
    </>
  );
  // return (
  //   <>
  //     {field.state.meta.isTouched && !field.state.meta.isValid ? (
  //       <em
  //         className={
  //           field.state.meta.errors.length ? "text-destructive text-sm" : ""
  //         }
  //       >
  //         {field.state.meta.errors.map((err) => err.message).join(",")}
  //       </em>
  //     ) : null}
  //     {field.state.meta.isValidating ? `${LL.auth.validating()}` : null}
  //     {/* {field.state.meta.isValidating ? "Validating..." : null} */}
  //   </>
  // );
}

export function Login() {
  const { LL, locale } = useI18nContext();

  const { cartCode, setCartCode } = useCart();
  const { refreshUser } = useUser(); // Забираем функцию принудительного
  // обновления профиля

  const navigate = useNavigate({ from: "/$lang" });

  // const search: any = useSearch({ strict: false });

  // Читаем параметр redirect из URL строки
  const { redirect: redirectToPage } = Route.useSearch();

  const onLoginSuccess = async () => {
    // const targetPath = (search.redirect || "/$lang/profile") as any;

    // 2. КРИТИЧЕСКИЙ ШАГ: Мгновенно пинаем контекст пользователя,
    // чтобы он скачал данные профиля с Django!
    await refreshUser();

    // 3. И только после того, как данные скачались, плавно перенаправляем
    // на профиль или страницу, с которой пришли

    if (redirectToPage) {
      // ВАРИАНТ А: Если пользователя перекинуло из корзины или карточки товара
      // Нам прилетит полный URL типа "http://localhost:5173/ru/products/product-1"
      // Просто парсим его или отдаем навигатору, убрав доменную часть:
      const targetPath = redirectToPage.replace(window.location.origin, "");

      // Динамически собираем строку для регулярного выражения.
      // Если массив ['ru', 'en'], то join('|') превратит его в "ru|en"
      const languagesPattern = SUPPORTED_LANGUAGES.join("|");

      // Создаем регулярное выражение на лету: /^\/(ru|en)\/?$/
      const homePageRegex = new RegExp(`^\\/(${languagesPattern})\\/?$`);

      // Проверяем путь
      const isHomePage = homePageRegex.test(targetPath);

      // Регулярное выражение, которое проверяет, равен ли путь строго
      //  "/ru", "/en", "/ru/" или "/en/"

      // const isHomePage = /^\/(ru|en)\/?$/.test(targetPath);

      if (isHomePage) {
        // ЕСЛИ ЭТО ГЛАВНАЯ СТРАНИЦА: Игнорируем редирект и ведем пользователя
        // в Профиль
        await navigate({
          to: "/$lang/profile",
          params: { lang: locale },
        });
      } else {
        // ЕСЛИ ЭТО ЛЮБАЯ ДРУГАЯ СТРАНИЦА (Товар, Корзина и т.д.): Железно
        // возвращаем назад
        window.location.href = targetPath;
        // Железно возвращаем пользователя назад
        // (Использование window.location здесь безопаснее всего, так как полностью
        // сбросит и переинициализирует контексты роутера под нового
        // авторизованного юзера)
      }
    } else {
      // ВАРИАНТ Б: Если инфы откуда пришел нет — отправляем в Профиль как обычно
      // Подстраховка на случай, если каким-то чудом параметра не оказалось
      await navigate({
        to: "/$lang/profile",
        params: { lang: locale },
      });
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as Login,

    validators: {
      onChange: LoginSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        // 1. Добавляем текущий гостевой код в данные запроса
        const loginData = {
          ...value,
          cart_code: cartCode, // <--- Передаем код бэкенду
        };

        const response = await login(loginData);

        // 2. Если мы здесь, значит статус 200 (благодаря нашему перехватчику в api.ts)
        toast.success(LL.auth.authorized());
        // toast.success("You have been successfully authorized 👋!");

        localStorage.setItem("Token", response.data.token);

        if (response.data.cart_code) {
          localStorage.setItem("cart_code", response.data.cart_code);
          setCartCode(response.data.cart_code);
        }

        onLoginSuccess();
      } catch (error: any) {
        // 3. Сюда попадем, если сервер вернул 401, 400 или 500
        toast.error(
          LL.auth.failed(),

          // error.response?.data?.error || LL.auth.failed(),

          // "Login has failed. Please check your credentials. 🤚 🚨",
        );
      }
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Отправляем только токен Google и код корзины
        const response = await googleLoginAction(tokenResponse, cartCode);

        // Дальше логика как при обычном логине
        localStorage.setItem("Token", response.data.token);
        localStorage.setItem("cart_code", response.data.cart_code);
        setCartCode(response.data.cart_code);
        toast.success(LL.auth.welcome());
        // toast.success("Welcome! Signed in with Google.");
        onLoginSuccess();
      } catch (error: any) {
        toast.error(
          LL.auth.failedGoogle(),
          // error.response?.data?.error || LL.auth.failedGoogle(),
          // error.response?.data?.error || "Google Authentication failed",
        );
      }
    },
  });

  return (
    <>
      <>
        <title>
          {LL.auth.headLogin()}
          {/* E-Shop | Login */}
        </title>
        <meta
          name="description"
          content="LOGIN page is for user's authentication inside the application."
        />
        <link rel="canonical" href={`${BASE_URL}/$lang/login`} />
      </>
      <section
        className="mt-10 xsm:mt-0 xsm:h-dvh
              flex justify-content-center align-items-center"
      >
        <Card className="w-[90%] max-w-sm m-auto">
          <CardHeader>
            <Link
              to="/$lang"
              className="flex items-center gap-2 text-sm text-gray-500
              hover:text-primary transition-colors mb-6"
            >
              <MoveLeft size={16} />
              {LL.auth.back()}
              {/* Back to Store */}
            </Link>

            <CardTitle className="text-2xl">
              {LL.auth.loginTitle()}
              {/* Login to your account */}
            </CardTitle>
            <CardDescription>
              {LL.auth.loginSubtitle()}
              {/* Enter your email below to login to your account */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="flex flex-col gap-6">
                <form.Field
                  name="email"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="email">
                        {LL.auth.email()}
                        {/* Email */}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="mail@example.com"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
                <form.Field
                  name="password"
                  children={(field) => (
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">
                          {LL.auth.password()}
                          {/* Password */}
                        </Label>
                        <Link
                          to="/$lang/passwordResetRequest"
                          className="ml-auto inline-block text-sm 
                              underline-offset-4 hover:underline"
                        >
                          {LL.auth.forgot()}
                          {/* Forgot your password? */}
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <CardAction className="w-full">
              <div className="grid grid-cols-2 gap-2 flex items-center">
                <CardDescription>
                  {LL.auth.noAccount()}
                  {/* No account yet? */}
                </CardDescription>
                <Button variant="link" className="justify-self-end">
                  <Link to="/$lang/register">
                    {LL.auth.signUp()}
                    {/* Sign Up */}
                  </Link>
                </Button>
              </div>
            </CardAction>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              onClick={form.handleSubmit}
            >
              {LL.auth.login()}
              {/* Login */}
            </Button>

            <div className="mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    {LL.auth.or()}
                    {/* Or continue with */}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl h-12"
              onClick={() => googleLogin()}
            >
              <FcGoogle className="mr-2 size-6" />
              {LL.auth.google()}
              {/* Continue with Google */}
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
