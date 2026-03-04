// 1. Описываем структуру данных, которую принимает метод
interface PaymentFields {
  cardNumber: string;
  expDateMonth: string;
  expDateYear: string;
  cvv: string;
}

// 2. Описываем структуру самой библиотеки
interface CloudPayments {
  Checkout: new (options: { publicId: string }) => {
    createPaymentCryptogram: (values: PaymentFields) => Promise<string>;
  };
}

// 3. Объявляем глобальную переменную cp
declare const cp: CloudPayments;
