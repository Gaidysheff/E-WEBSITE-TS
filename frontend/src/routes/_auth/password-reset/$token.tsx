import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/password-reset/$token")({
  component: PasswordReset,
});

export function PasswordReset() {
  return <div>Hello "/_auth/password-reset/$token"!</div>;
}
