import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/passwordResetRequest")({
  component: PasswordResetRequest,
});

export function PasswordResetRequest() {
  return <div>Hello "/_auth/passwordResetRequest"!</div>;
}
