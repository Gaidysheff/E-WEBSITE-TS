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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/register")({
  component: Register,
});

export function Register() {
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
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password2">Confirm Password</Label>
                <Input id="password2" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
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
