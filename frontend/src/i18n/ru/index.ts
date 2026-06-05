import type { BaseTranslation } from "../i18n-types.js";

const ru: BaseTranslation = {
  introduction: {
    slogan: '"Кликай. Покупай. Наслаждайся!"',
  },
  hero: {
    title: "Найдите идеальный товар для любых потребностей.",
    subtitle:
      "Откройте для себя тщательно отобранную коллекцию высококачественных товаров, созданных для учёта вашего образа жизни.",
    btn: "Показать",
  },
  categorySection: {
    title: "Просмотр по категориям",
    error:
      "Извините, возникла непредвиденная ОШИБКА сервера при загрузки списка категорий!!!",
  },
  productSection: {
    titleFeatured: "Рекомендуемые товары",
    titleRelated: "Товары из той же категории",
    details: "Полное описание:",
    adding: "Добавляем ...",
    added: "Уже в корзине",
    addCart: "В корзину",
    updating: "Обновляем ...",
    remove: "Удалить",
    addWishlist: "В Избранное",
    toastError: "Что-то пошло не так.",
    toastCartSuccess: "Выбранный товар успешно добавлен!",
    toastWishlistSuccess: "Товар успешно добавлен в Избранное!",
    toastWishlistInfo: "Товар успешно удалён из Избранного!",
    reviews: "Отзывы покупателей",
    excellent: "Отлично",
    veryGood: "Очень хорошо",
    good: "Xорошо",
    fair: "Удовлетворительно",
    poor: "Плохо",
    reviewsCount: "из {count:number} {reviewWord:string}",
  },

  failedPage: {
    title: "Ой! Ошибка оплаты.",
    description:
      "Что-то пошло не так при обработке вашего платежа. Не беспокойтесь — средства с вашей карты не были списаны.",
    tryAgain: "Попробовать снова",
    contactUs: "Свяжитесь с нами",
    contactSupportWa: "Поддержка — WhatsApp",
    contactSupportEmail: "Поддержка — Email",
    chatWithSupport: "Чат с поддержкой",
    // Динамическая строка для темы письма
    emailSubject: "Ошибка оплаты заказа (Корзина: {cartCode:string})",
  },
};

export default ru;
