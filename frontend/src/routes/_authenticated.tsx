import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    // Проверяем именно наличие токена
    const isAuthenticated = !!localStorage.getItem("Token");

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  // Компонент теперь максимально простой
  component: () => <Outlet />,
});
