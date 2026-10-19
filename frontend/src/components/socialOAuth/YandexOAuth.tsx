import YandexLogo from "@/assets/images/icons/logo-yandex.svg";

const YandexOAuth = () => {
  const YANDEX_CLIENT_ID = import.meta.env.VITE_YANDEX_CLIENT_ID;

  // Ссылка-редирект должна СТРОГО совпадать с тем, что вы вписали в панели Яндекса
  // Для тестов на локалке:

  const BASE_URL = import.meta.env.VITE_API_FRONTEND_URL;
  const REDIRECT_URI = encodeURIComponent(
    `${BASE_URL}/ru/yandex-auth-callback`,
  );

  // Точно прописываем нужные права доступа через пробел
  // const SCOPES = "login:email login:info login:birthday login:avatar";
  const SCOPES =
    "login:email login:info login:birthday login:avatar login:default_phone";
  const ENCODED_SCOPES = encodeURIComponent(SCOPES);

  // СБОРКА С УЧЕТОМ SCOPE:

  const YANDEX_AUTH_URL = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${ENCODED_SCOPES}&force_confirm=yes`;

  return (
    <div>
      <a
        href={YANDEX_AUTH_URL}
        target="_self"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border border-gray-300
        rounded-sm p-2 hover:bg-gray-50 transition-all cursor-pointer"
      >
        <img
          className="grow-0 w-auto h-[3rem]"
          src={YandexLogo}
          alt="Yandex Logo"
        />
      </a>
    </div>
  );
};

export default YandexOAuth;
