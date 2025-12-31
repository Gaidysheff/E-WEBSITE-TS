import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import type { AnyFieldApi } from "@tanstack/react-form";
// import { type User } from "@/lib/types.ts";
import { Button } from "@/components/ui/button";
import Google from "@/assets/images/shared/google.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/api/endpoints_auth";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

// import { type FormEvent } from "react";

export const Route = createFileRoute("/_auth/login")({
  component: Login,
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

// type Login = Pick<User, "email" | "password">;
type Login = z.infer<typeof LoginSchema>;

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={
            field.state.meta.errors.length ? "text-destructive text-sm" : ""
          }
        >
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export function Login() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as Login,

    validators: {
      onChange: LoginSchema,
    },

    onSubmit: async ({ value }) => {
      // Do something with data
      // alert(JSON.stringify(value, null, 2));
      console.log("🚀 ~ Login ~ value:", value);
      login(value);
      navigate({ to: `/` });
    },
  });

  // const submitHandler = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   console.log("🚀 ~ Login ~ value: submitHandler");
  // };

  return (
    <section
      className="mt-10 xsm:mt-0 xsm:h-dvh
            flex justify-content-center align-items-center"
    >
      <Card className="w-[90%] max-w-sm m-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <form onSubmit={submitHandler}> */}
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
              <form.Field
                name="password"
                children={(field) => (
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="/passwordResetRequest"
                        className="ml-auto inline-block text-sm 
                            underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
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
              <CardDescription>No account yet?</CardDescription>
              <Button variant="link" className="justify-self-end">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </CardAction>

          <Button type="submit" className="w-full" onClick={form.handleSubmit}>
            Login
          </Button>
          <Button variant="outline" className="w-full">
            <img
              src={Google}
              alt="Google Icon"
              width={20}
              height={20}
              className="mr-3"
            />
            Continue with Google
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
