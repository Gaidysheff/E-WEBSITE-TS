export interface CardData {
  cvv?: string; // CVV/CVC код
  cardNumber?: string; // Номер карты, наличие пробелов не имеет значения
  expDateMonth?: string; // Срок действия карты - месяц
  expDateYear?: string; // Срок дейcтвия карты - год
  expDateMonthYear?: string; // Срок действия карты, все символы за исключением цифр игнорируются,
  //Если длина строки 2,3 или 5 символов то первая цифра воспринимается как месяц, оставшиеся как год.
  //Если длина строки 4 или 6 символов то первые два трактуются как месяц, а оставшиеся как год.
}

const checkout = new cp.Checkout({
  publicId: "test_api_000000000000000002",
});

const fieldValues: CardData = {
  cvv: "911",
  cardNumber: "4242 4242 4242 4242",
  expDateMonth: "12",
  expDateYear: "24",
};

checkout
  .createPaymentCryptogram(fieldValues)
  .then((cryptogram: any) => {
    console.log(cryptogram);
  })
  .catch((errors: any) => {
    console.log(errors);
  });
