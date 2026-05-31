import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_mainLayout/_authenticated")({
  beforeLoad: ({ params, location }) => {
    // Проверяем именно наличие токена
    const isAuthenticated = !!localStorage.getItem("Token");
    const currentLang = params.lang || "ru";

    if (!isAuthenticated) {
      throw redirect({
        to: "/$lang/login",
        params: { lang: currentLang },
        // Запоминаем, куда пользователь хотел попасть (например, в корзину),
        // чтобы после успешного логина вернуть его обратно
        search: {
          redirect: location.href,
        },
      });
    }
  },
  // Компонент теперь максимально простой
  component: () => <Outlet />,
});
