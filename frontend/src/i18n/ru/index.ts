import type { BaseTranslation } from "../i18n-types.js";

const ru: BaseTranslation = {
  general: {
    cancel: "Отменить",
    continue: "Продолжить",
  },
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
    addWishlist: "В Избранное",
    addReview: "Добавить отзыв",
    addingReview: "Добавляем отзыв ...",
    updatingReview: "Обновляем отзыв ...",
    updateReview: "Обновить отзыв",
    updating: "Обновляем ...",
    remove: "Удалить",
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
    btnLogin: "Авторизуйтесь, чтобы оставить отзыв",
    reviewFormTitle: "Оцените и оставьте отзыв об этом товаре.",
    reviewScore: "Оценка товару",
    reviewPlaceholder: "Напишите свой отзыв...",
    published: "опубликовано ...",
    edited: "отредактировано ...",
    dialogTitle: "Вы абсолютно уверены?",
    dialogSubTitle: "Вы собираетесь удалить этот товар из корзины.",
    dialogAlert:
      "Это действие необратимо. В результате ваш отзыв о данном товаре будет безвозвратно удалён с нашего сервера.",
    reviewsNo: "Отзывы",
    review: "Отзыв",
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
