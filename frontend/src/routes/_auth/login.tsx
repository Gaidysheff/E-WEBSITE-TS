import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Google from "@/assets/images/shared/google.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: Login,
});

export function Login() {
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
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4
                    hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <CardAction className="w-full">
            <div className="grid grid-cols-2 gap-2 flex items-center">
              <CardDescription>No account yet?</CardDescription>
              <Button variant="link" className="justify-self-end">
                Sign Up
              </Button>
            </div>
          </CardAction>

          <Button type="submit" className="w-full">
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
