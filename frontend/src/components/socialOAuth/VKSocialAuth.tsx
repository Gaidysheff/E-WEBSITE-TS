import * as VKID from "@vkid/sdk";

import { useCallback, type ReactElement } from "react";

import MailRuLogo from "@/assets/images/icons/logo-mailru.svg";
import OKLogo from "@/assets/images/icons/logo-ok.svg";
import VKLogo from "@/assets/images/icons/logo-vk.svg";

// import { useCallback, useEffect, type ReactElement } from "react";

// Функция генерации PKCE по стандарту RFC 7636
// async function generatePKCE() {
//   const array = new Uint32Array(32);
//   window.crypto.getRandomValues(array);
//   const codeVerifier = Array.from(array, (n) =>
//     n.toString(36).padStart(2, "0"),
//   ).join("");

//   const encoder = new TextEncoder();
//   const data = encoder.encode(codeVerifier);
//   const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const codeChallenge = btoa(String.fromCharCode.apply(null, hashArray))
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+\$/, "");

//   return { codeVerifier, codeChallenge };
// }

// Единый компонент для всех трёх провайдеров
const VKIDOAuthButton = ({
  provider,
  label,
}: {
  provider: "vkid" | "ok_ru" | "mail_ru";
  label: ReactElement;
}) => {
  const CLIENT_ID = import.meta.env.VITE_VKID_CLIENT_ID; // client_id от VK ID
  const BASE_URL = import.meta.env.VITE_API_FRONTEND_URL;
  // const REDIRECT_URI = encodeURIComponent(`${BASE_URL}/ru/vk-auth-callback`);

  // const handleClick = useCallback(async () => {
  //   // 1. Генерируем PKCE
  //   const { codeVerifier, codeChallenge } = await generatePKCE();

  //   // 2. Сохраняем верификатор, чтобы прочитать его на странице коллбэка!
  //   sessionStorage.setItem("vk_code_verifier", codeVerifier);

  //   // 3. Строим идеальный URL по вытащенной вами официальной документации VK ID
  //   let sdkProvider: "vkid" | "ok" | "mail" = "vkid";
  //   if (provider === "ok_ru") sdkProvider = "ok";
  //   if (provider === "mail_ru") sdkProvider = "mail";

  //   const authUrl =
  //     `https://id.vk.ru/authorize` +
  //     `?response_type=code` +
  //     `&client_id=${CLIENT_ID}` +
  //     `&redirect_uri=${REDIRECT_URI}` +
  //     `&code_challenge=${codeChallenge}` +
  //     `&code_challenge_method=s256` +
  //     `&state=vkid_${provider}` +
  //     `&scope=email%20phone` +
  //     `&provider=${sdkProvider}` +
  //     `&scheme=dark`;

  //   // Делаем чистый переход
  //   window.location.assign(authUrl);
  // }, [provider, CLIENT_ID, BASE_URL]);

  // ===================================================================
  // 1. Инициализируем конфигурацию.
  // useEffect(() => {
  //   VKID.Config.init({
  //     app: Number(CLIENT_ID),
  //     redirectUrl: `${BASE_URL}/ru/vk-auth-callback`,
  //     scope: "email phone",
  //   });
  // }, [CLIENT_ID, BASE_URL]);

  const handleClick = useCallback(() => {
    try {
      let sdkProviderStr: "vkid" | "ok" | "mail" = "vkid";
      if (provider === "ok_ru") sdkProviderStr = "ok";
      if (provider === "mail_ru") sdkProviderStr = "mail";

      const finalProvider = sdkProviderStr as VKID.OAuthName;

      // ПЕРЕИНИЦИАЛИЗИРУЕМ КОНФИГ СВЕЖИМ STATE ПЕРЕД ВХОДОМ
      VKID.Config.init({
        app: Number(CLIENT_ID),
        redirectUrl: `${BASE_URL}/ru/vk-auth-callback`,
        state: `vkid_${provider}`, // Вшиваем state конкретной нажатой кнопки
        scope: "email phone",
      });

      // Теперь вызываем чистый login, TypeScript будет счастлив
      VKID.Auth.login({
        provider: finalProvider,
      });
    } catch (error) {
      console.error("Ошибка авторизации VKID SDK:", error);
    }
  }, [provider, CLIENT_ID, BASE_URL]);

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 border border-gray-300
        rounded-sm p-2 hover:bg-gray-50 transition-all cursor-pointer"
    >
      <div>{label}</div>
    </button>
  );
};

const VK = (
  <img className="grow-0 w-auto h-[3rem]" src={VKLogo} alt="Yandex Logo" />
);
const OK = (
  <img className="grow-0 w-auto h-[3rem]" src={OKLogo} alt="Yandex Logo" />
);
const MailRu = (
  <img className="grow-0 w-auto h-[3rem]" src={MailRuLogo} alt="Yandex Logo" />
);

// Использование — три кнопки, один client_id
const VKSocialAuth = () => (
  <div className="flex gap-2">
    <VKIDOAuthButton provider="vkid" label={VK} />
    <VKIDOAuthButton provider="ok_ru" label={OK} />
    <VKIDOAuthButton provider="mail_ru" label={MailRu} />
  </div>
);

export default VKSocialAuth;
