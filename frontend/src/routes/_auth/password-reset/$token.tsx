import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordConfirm } from "@/api/endpoints_auth";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

export const Route = createFileRoute("/_auth/password-reset/$token")({
  component: PasswordReset,
});

const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      // .max(20, "Password must be not more than 20 characters")
      .refine(
        (password) => /[A-Z]/.test(password),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (password) => /[a-z]/.test(password),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (password) => /[0-9]/.test(password),
        "Password must contain at least one number"
      )
      .refine(
        (password) => /[!@#$%^&*]/.test(password),
        "Password must contain at least one special character, for example: !@#$%^&*"
      ),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
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
  const token = useParams({
    from: "/_auth/password-reset/$token",
    select: (params) => params.token,
  });

  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
    } as PasswordReset,

    validators: {
      onChange: PasswordResetSchema,
    },

    onSubmit: async ({ value }) => {
      passwordConfirm(value, token);

      setTimeout(() => {
        navigate({ to: `/login` });
      }, 3000);
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
            <CardTitle className="text-2xl">Reset password</CardTitle>
            <CardDescription>
              Enter your new password and confirm it.
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
                      <Label htmlFor="password">Password</Label>
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
                      <Label htmlFor="confirm_password">Confirm Password</Label>
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
              Reset password
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
