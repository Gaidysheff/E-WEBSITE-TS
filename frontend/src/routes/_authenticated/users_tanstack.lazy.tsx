import { UsersPage } from "./users_tanstack.tsx";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/users_tanstack")({
  component: UsersPage,
});
