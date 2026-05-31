import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  // Как только пользователь заходит на чистый "/"
  beforeLoad: () => {
    // Вытаскиваем сохраненный язык из localStorage или проверяем язык браузера
    const savedLang = localStorage.getItem("app_lang") || "ru";

    // Делаем мгновенный серверный редирект роутера на нужный язык
    throw redirect({
      to: "/$lang",
      params: { lang: savedLang },
    });
  },
});
