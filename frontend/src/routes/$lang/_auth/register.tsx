import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { AnyFieldApi } from "@tanstack/react-form";
import { BASE_URL } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLink as Link } from "@/components/appLink/AppLink";
import { createFileRoute } from "@tanstack/react-router";
import { getZodTranslation } from "@/lib/i18nHelper.ts";
import { register } from "@/api/endpoints_auth";
import { toast } from "react-toastify";
import { useAppNavigate } from "@/hooks/useAppNavigate.ts";
import { useForm } from "@tanstack/react-form";
import { useI18nContext } from "@/i18n/i18n-react";
import { z } from "zod";

export const Route = createFileRoute("/$lang/_auth/register")({
  component: Register,
});

const RegisterSchema = z
  .object({
    email: z.email("auth.emailInvalid"),
    // email: z.email(),
    password: z
      .string()
      .min(4, "auth.passwordMin")
      // .min(4, "Password must be at least 4 characters")
      .refine(
        (password) => /[A-Z]/.test(password),
        "auth.password_AZ",
        // "Password must contain at least one uppercase letter",
      )
      .refine(
        (password) => /[a-z]/.test(password),
        "auth.password_az",
        // "Password must contain at least one lowercase letter",
      )
      .refine(
        (password) => /[0-9]/.test(password),
        "auth.password_09",
        // "Password must contain at least one number",
      )
      .refine(
        (password) => /[!@#$%^&*]/.test(password),
        "auth.passwordSpecial",
        // "Password must contain at least one special character, for example: !@#$%^&*",
      ),
    confirm_password: z.string().min(1, "auth.mustConfirm"),
    // confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "auth.notMatch",
    // message: "Passwords don't match",
    path: ["confirm_password"], // Specifies where the error message should appear
  });

type Register = z.infer<typeof RegisterSchema>;

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
          {field.state.meta.errors
            .map((err) => {
              // Если ошибка прилетела от Zod (строка содержит точку), переводим её
              const errMsg = err?.message || String(err);
              return errMsg.includes(".")
                ? // ? getTranslatedMessage(errMsg)
                  getZodTranslation(errMsg, LL)
                : errMsg;
            })
            .join(", ")}
        </em>
      ) : null}

      {/* Мгновенный перевод статуса проверки */}
      {field.state.meta.isValidating ? (
        <span className="text-gray-400 text-sm">{LL.auth.validating()}</span>
      ) : null}
    </>
  );
}

export function Register() {
  const { LL } = useI18nContext();

  const navigate = useAppNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    } as Register,

    validators: {
      onChange: RegisterSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await register(value);

        toast.success(
          LL.auth.registered(),
          // "You have been successfully registered 👋!",
        );

        navigate({ to: `/$lang/login` });
      } catch (error: any) {
        toast.error(
          LL.auth.failedReg(),
          // "Registration has failed. Please, try again. 🤚 🚨",
        );
      }
    },
  });

  return (
    <>
      <>
        <title>
          {LL.auth.headRegister()}
          {/* E-Shop | Register */}
        </title>
        <meta
          name="description"
          content="REGISTER page is for user's registration inside the application."
        />
        <link rel="canonical" href={`${BASE_URL}/register`} />
      </>
      <section
        className="mt-10 xsm:mt-0 xsm:h-dvh flex justify-content-center
        align-items-center"
      >
        <Card className="w-[90%] max-w-sm m-auto">
          <CardHeader>
            <CardTitle className="text-2xl">
              {LL.auth.registerTitle()}
              {/* Register your account */}
            </CardTitle>
            <CardDescription>
              {LL.auth.registerSubtitle()}
              {/* Enter your email below to register your account */}
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
                        className={
                          field.state.meta.errors.length > 0
                            ? "text-destructive border border-red-500"
                            : ""
                        }
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
                {/* ========================================== */}
                <form.Field
                  name="password"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="password">
                        {LL.auth.password()}
                        {/* Password */}
                      </Label>
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
                {/* ========================================== */}
                <form.Field
                  name="confirm_password"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="confirm_password">
                        {LL.auth.confirmPassword()}
                        {/* Confirm Password */}
                      </Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              onClick={form.handleSubmit}
            >
              {LL.auth.signUp()}
              {/* Sign Up */}
            </Button>

            <CardAction className="w-full my-5">
              <div className="grid grid-cols-2 gap-2 flex items-center">
                <CardDescription>
                  {LL.auth.loginQuestion()}
                  {/* Already registered? */}
                </CardDescription>
                <Link
                  className="justify-self-end text-sm font-semibold 
                  hover:underline hover:underline-offset-4"
                  to="/$lang/login"
                >
                  {LL.auth.loginLink()}
                  {/* Please Login */}
                </Link>
              </div>
            </CardAction>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
