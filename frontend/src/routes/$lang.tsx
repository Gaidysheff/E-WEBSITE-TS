import { createFileRoute, redirect } from "@tanstack/react-router";

// Список языков, которые поддерживает ваш сайт

// Добавляем export, чтобы массив стал виден всему приложению

export const SUPPORTED_LANGUAGES = ["ru", "en"];

// export const SUPPORTED_LANGUAGES = ['ru', 'en', 'zh', 'de'];

export const Route = createFileRoute("/$lang")({
  // Функция валидации параметров URL
  beforeLoad: ({ params }) => {
    const { lang } = params;

    // Если пользователь ввел в URL бред (например, /fr/cart или /about/cart),
    // роутер автоматически перенаправит его на дефолтный русский язык
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      throw redirect({
        to: "/ru", // или сохраняем текущий путь, но подставляя /ru
      });
    }
    // Сохраняем валидный язык в память браузера для нашего корневого редиректа
    localStorage.setItem("app_lang", lang);
  },
});
