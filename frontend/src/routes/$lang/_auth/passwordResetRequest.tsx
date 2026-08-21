import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";
import { getZodTranslation } from "@/lib/i18nHelper.ts";
import { passwordResetRequest } from "@/api/endpoints_auth";
import { toast } from "react-toastify";
import { useAppNavigate } from "@/hooks/useAppNavigate.ts";
import { useForm } from "@tanstack/react-form";
import { useI18nContext } from "@/i18n/i18n-react";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/$lang/_auth/passwordResetRequest")({
  component: PasswordResetRequest,
});

const schema = z.object({
  email: z
    .string() // — базовый тип.
    .min(1, { message: "auth.mustField" })
    // .min(1, { message: "Поле обязательно" })
    // — чтобы поймать пустую строку до сложной проверки форма
    .pipe(
      z
        // .email({ message: "auth.emailInvalid" })
        .email({ message: "auth.emailInvalid" })
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

export function PasswordResetRequest() {
  const [loading, setLoading] = useState<boolean>(false);

  const { LL } = useI18nContext();

  const navigate = useAppNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: schema,
    },

    onSubmit: async ({ value }) => {
      try {
        setLoading(true);
        await passwordResetRequest(schema.parse(value));

        toast.success(
          LL.auth.passwordResetRequestMessage(),
          { autoClose: 5000 },
          // "If your email exists you have received an email with \
          //   instructions for resetting the password",
          // { autoClose: 5000 },
        );

        navigate({ to: `/$lang/login` });
      } catch (error) {
        toast.error(LL.general.failed());
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section
      className="mt-10 xsm:mt-0 xsm:h-dvh
      flex flex-col justify-content-center align-items-center"
    >
      <div className="w-[90%] max-w-sm m-auto">
        {loading && <Spinner className="size-30 text-myMainColor mx-auto" />}

        <Card className="">
          <CardHeader>
            <CardTitle className="text-2xl">
              {LL.auth.passResetRequestTitle()}
              {/* Request password reset */}
            </CardTitle>
            <CardDescription>
              {LL.auth.passResetRequestSubtitle()}
              {/* Enter your email below to request password reset */}
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
                      <Label htmlFor="email">Email</Label>
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
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              onClick={form.handleSubmit}
            >
              {LL.auth.passResetRequestBtn()}
              {/* Request password reset */}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
