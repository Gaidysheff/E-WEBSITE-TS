import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, useParams } from "@tanstack/react-router";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordConfirm } from "@/api/endpoints_auth";
import { toast } from "react-toastify";
import { useAppNavigate } from "@/hooks/useAppNavigate.ts";
import { useForm } from "@tanstack/react-form";
import { useI18nContext } from "@/i18n/i18n-react";
import { z } from "zod";

export const Route = createFileRoute("/$lang/_auth/password-reset/$token")({
  component: PasswordReset,
});

const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, "auth.passwordMin")
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

type PasswordReset = z.infer<typeof PasswordResetSchema>;

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={
            field.state.meta.errors.length ? "text-destructive text-sm" : ""
          }
        >
          {field.state.meta.errors.map((err) => err.message)[0]}
          {/* {field.state.meta.errors.map((err) => err.message).join(",")} */}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export function PasswordReset() {
  const { LL } = useI18nContext();

  const token = useParams({
    from: "/$lang/_auth/password-reset/$token",
    select: (params) => params.token,
  });

  const navigate = useAppNavigate();

  const form = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
    } as PasswordReset,

    validators: {
      onChange: PasswordResetSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await passwordConfirm(value, token);

        toast.success(
          LL.auth.passwordChangedMessage(),
          // "Your password has been successfully changed."
        );

        navigate({ to: `/$lang/login` });

        // setTimeout(() => {
        //   navigate({ to: `/$lang/login` });
        // }, 3000);
      } catch (error) {
        toast.error(LL.general.failed());
        // toast.error("Something went wrong. Please, try again");
      }
    },
  });

  return (
    <section
      className="mt-10 xsm:mt-0 xsm:h-dvh
              flex justify-content-center align-items-center"
    >
      <div className="w-[90%] max-w-sm m-auto">
        <Card className="">
          <CardHeader>
            <CardTitle className="text-2xl">
              {LL.auth.passResetTitle()}
              {/* Reset password */}
            </CardTitle>
            <CardDescription>
              {LL.auth.passResetSubtitle()}
              {/* Enter your new password and confirm it. */}
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
              {LL.auth.passResetBtn()}
              {/* Reset password */}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
