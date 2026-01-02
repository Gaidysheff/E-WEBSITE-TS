import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordResetRequest } from "@/api/endpoints_auth";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

export const Route = createFileRoute("/_auth/passwordResetRequest")({
  component: PasswordResetRequest,
});

const schema = z.object({
  email: z.email(),
});

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

export function PasswordResetRequest() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: schema,
    },

    onSubmit: async ({ value }) => {
      console.log("🚀 ~ PasswordResetRequest ~ value:", value);
      passwordResetRequest(value);

      setTimeout(() => {
        navigate({ to: `/login` });
      }, 3000);
    },
  });

  return (
    <section
      className="mt-10 xsm:mt-0 xsm:h-dvh
              flex flex-col justify-content-center align-items-center"
    >
      <div className="w-[90%] max-w-sm m-auto">
        <Card className="">
          <CardHeader>
            <CardTitle className="text-2xl">Request password reset</CardTitle>
            <CardDescription>
              Enter your email below to request password reset
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
              Request password reset
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
