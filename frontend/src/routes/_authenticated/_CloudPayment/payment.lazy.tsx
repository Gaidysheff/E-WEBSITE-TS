import BankCard from "@/components/payment/BankCard";
import BankCardWithAnimation from "@/components/paymentWithAnimation/BankCardWithAnimation";
import CloudPayments from "@/components/svgImages/CloudPayments";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_authenticated/_CloudPayment/payment",
)({
  component: Payment,
});

function Payment() {
  const CardDataHandler = (CardData: Record<string, string>) => {
    // 1. Массив и join (Самый чистый способ)
    const cardNumber = [
      CardData.firstSet,
      CardData.secondSet,
      CardData.thirdSet,
      CardData.fourthSet,
      CardData.additionalSet,
    ].join(""); // Склеит всё в одну строку без пробелов

    // 2. Деструктуризация (Если нужно исключить лишнее)
    const { userName, month, year, cvc, ...numberSets } = CardData;
    // numberSets теперь содержит только firstSet, secondSet и т.д.

    const cardNumber2 = Object.values(numberSets).join("");

    // 3. Простое склеивание
    const cardNumber3 = `${CardData.firstSet}${CardData.secondSet}${CardData.thirdSet}${CardData.fourthSet}${CardData.additionalSet}`;

    console.log("🚀 ~ CardDataHandler ~ cardNumber:", cardNumber);
    console.log("🚀 ~ CardDataHandler ~ CardData:", CardData);
    console.log("🚀 ~ CardDataHandler ~ cardNumber2:", cardNumber2);
    console.log("🚀 ~ CardDataHandler ~ cardNumber3:", cardNumber3);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1
        className="text-lg 2xsm:text-2xl xsm:text-3xl sm:text-4xl md:text-5xl 
        mt-5 sm:mt-10 -mr-[2rem] 2xsm:-mr-[2.4rem] xsm:-mr-[3rem] sm:-mr-[4rem]
        text-primaryDark"
      >
        Payment through
      </h1>
      <div
        className="w-[15rem] 2xsm:w-[18rem] xsm:w-[22.5rem] sm:w-[30rem]
        -mr-[2rem] 2xsm:-mr-[2.4rem] xsm:-mr-[3rem] sm:-mr-[4rem] mt-5 sm:mt-10"
      >
        <CloudPayments />
      </div>
      <div className="my-10 sm:my-20">
        <BankCard onSubmitData={CardDataHandler} />
      </div>
      <div className="my-10 sm:my-20">
        <BankCardWithAnimation onSubmitData={CardDataHandler} />
      </div>
    </div>
  );
}
