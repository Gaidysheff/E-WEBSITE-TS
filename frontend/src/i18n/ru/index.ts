import type { BaseTranslation } from "../i18n-types.js";

const ru: BaseTranslation = {
  failedPage: {
    title: "Ой! Ошибка оплаты.",
    description:
      "Что-то пошло не так при обработке вашего платежа. Не беспокойтесь — средства с вашей карты не были списаны.",
    tryAgain: "Попробовать снова",
    contactSupportWa: "Поддержка — WhatsApp",
    contactSupportEmail: "Поддержка — Email",
    chatWithSupport: "Чат с поддержкой",
    // Динамическая строка для темы письма
    emailSubject: "Ошибка оплаты заказа (Корзина: {cartCode:string})",
  },
};

export default ru;
