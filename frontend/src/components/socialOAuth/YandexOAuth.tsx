import { useI18nContext } from "@/i18n/i18n-react";

const YandexOAuth = () => {
  const YANDEX_CLIENT_ID = import.meta.env.VITE_YANDEX_CLIENT_ID;

  // Ссылка-редирект должна СТРОГО совпадать с тем, что вы вписали в панели Яндекса
  // Для тестов на локалке:

  const BASE_URL = import.meta.env.VITE_API_FRONTEND_URL;
  const REDIRECT_URI = encodeURIComponent(
    `${BASE_URL}/ru/social-auth-callback`,
  );

  // Точно прописываем нужные права доступа через пробел
  // const SCOPES = "login:email login:info login:birthday login:avatar";
  const SCOPES =
    "login:email login:info login:birthday login:avatar login:default_phone";
  const ENCODED_SCOPES = encodeURIComponent(SCOPES);

  // СБОРКА С УЧЕТОМ SCOPE:

  const YANDEX_AUTH_URL = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${ENCODED_SCOPES}&force_confirm=yes`;

  const { LL } = useI18nContext();

  return (
    <div>
      <a
        href={YANDEX_AUTH_URL}
        target="_self"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border border-gray-300
        rounded-sm p-2 hover:bg-gray-50 transition-all cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          {/* Иконка или просто буква Я красного цвета */}
          <path
            fill="#fc3f1d"
            d="M12.5,0 C5.6,0 0,5.6 0,12.5 C0,19.4 5.6,25 12.5,25 C19.4,25 25,19.4 25,12.5 C25,5.6 19.4,0 12.5,0 Z M15.7,18.5 L13.7,18.5 L13.7,9.5 C13.7,8.7 13.2,8.2 12.5,8.2 C11.8,8.2 11.3,8.7 11.3,9.5 L11.3,18.5 L9.3,18.5 L9.3,9.5 C9.3,7.6 10.7,6.2 12.5,6.2 C14.3,6.2 15.7,7.6 15.7,9.5 L15.7,18.5 Z"
          />
        </svg>
        <span>
          {LL.auth.socialAuthCallback.yandexBtn()}
          {/* Войти через Яндекс */}
        </span>
      </a>
    </div>
  );
};

export default YandexOAuth;
