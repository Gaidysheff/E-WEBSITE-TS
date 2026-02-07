import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/api/endpoints_auth";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

export const Route = createFileRoute("/_auth/register")({
  component: Register,
});

const RegisterSchema = z
  .object({
    email: z.email(),
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

type Register = z.infer<typeof RegisterSchema>;

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

export function Register() {
  const navigate = useNavigate();
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
      register(value);

      setTimeout(() => {
        navigate({ to: `/login` });
      }, 3000);
    },
  });

  return (
    <section
      className="mt-10 xsm:mt-0 xsm:h-dvh flex justify-content-center
      align-items-center"
    >
      <Card className="w-[90%] max-w-sm m-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Register your account</CardTitle>
          <CardDescription>
            Enter your email below to register your account
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
          <Button type="submit" className="w-full" onClick={form.handleSubmit}>
            Sign Up
          </Button>

          <CardAction className="w-full my-5">
            <div className="grid grid-cols-2 gap-2 flex items-center">
              <CardDescription>Already registered?</CardDescription>
              <Link
                className="justify-self-end text-sm font-semibold 
                hover:underline hover:underline-offset-4"
                to="/login"
              >
                Please Login
              </Link>
            </div>
          </CardAction>
        </CardFooter>
      </Card>
    </section>
  );
}
