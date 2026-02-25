import Globe from "@/assets/images/payments/Globe.svg";
import CardLogo from "./CardLogo.tsx";
import CardNumber from "./CardNumber.tsx";
import CardVerificationCode from "./CardVerificationCode.tsx";
import Expiration from "./Expiration.tsx";
import HolderName from "./HolderName.tsx";

import Button from "@/components/uiComponents/Button";

import { useState, type FormEvent } from "react";

interface FormProps {
  onSubmitData: (data: Record<string, string>) => void;
}

const BankCard = ({ onSubmitData }: FormProps) => {
  const [cardType, setCardType] = useState(Globe);

  const currentYear = String(new Date().getFullYear());

  // Собираем все значения в единый объект
  const [formData, setFormData] = useState({
    userName: "",
    cvc: "",
    month: "1",
    year: currentYear,
    firstSet: "",
    secondSet: "",
    thirdSet: "",
    fourthSet: "",
  });

  // Универсальная функция для обновления любого поля
  const fieldChangeHandler = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    // Передаём собранный набор данных в верхний компонент
    onSubmitData(formData);
  };

  const isAllFilled = Object.values(formData).every(Boolean);

  return (
    <div>
      <form className="text-white relative" onSubmit={submitHandler}>
        {/* --------- Front side of the card --------- */}
        <div
          className="bg-myMainColorDark border-2 border-myMainColorDarker
          rounded-2xl p-4 xsm:p-6 sm:p-8 mb-20
          w-[13rem] 2xsm:w-[15.6rem] xsm:w-[19.5rem] sm:w-[26rem] 
          h-[8.25rem] 2xsm:h-[9.9rem] xsm:h-[12.375rem] sm:h-[16.5rem]
          flex flex-col gap-1 sm:gap-2 z-1 overflow-hidden relative
          before:content-[''] before:absolute before:h-[600px] before:w-[600px]
          before:rounded-[100%] before:bg-myMainColorLighter/50 before:-z-1
          before:-top-[380px] before:-left-[250px]
          after:content-[''] after:absolute after:h-[700px] after:w-[700px]
          after:rounded-[100%] after:bg-myMainColorLight/50 after:-z-1
          after:-bottom-[520px] after:-left-[200px]"
        >
          <CardLogo cardType={cardType} />

          <CardNumber
            numberSets={formData}
            getNumberSet={fieldChangeHandler}
            setCardType={setCardType}
          />

          <div className="flex justify-between gap-2">
            <HolderName
              userName={formData.userName}
              getName={(value) => fieldChangeHandler("userName", value)}
            />

            <Expiration
              month={formData.month}
              year={formData.year}
              getMonth={(value) => fieldChangeHandler("month", value)}
              getYear={(value) => fieldChangeHandler("year", value)}
            />
          </div>
        </div>
        {/* --------- Back side of the card --------- */}
        <div
          className="bg-myMainColorDark border-2 border-myMainColorDarker
          rounded-2xl p-8 absolute
          w-[13rem] 2xsm:w-[15.6rem] xsm:w-[19.5rem] sm:w-[26rem] 
          h-[8.25rem] 2xsm:h-[9.9rem] xsm:h-[12.375rem] sm:h-[16.5rem]
          top-[1rem] 2xsm:top-[1.2rem] xsm:top-[1.5rem] sm:top-[2rem]
          left-[2rem] 2xsm:left-[2.4rem] xsm:left-[3rem] sm:left-[4rem]"
        >
          <div
            className="bg-black absolute left-0 right-0 top-[1.5rem]
            h-[1.875rem] 2xsm:h-[2.25rem] xsm:h-[2.8125rem] sm:h-[3.75rem]"
          ></div>
          <CardVerificationCode
            cvc={formData.cvc}
            getCvc={(value) => fieldChangeHandler("cvc", value)}
          />
        </div>
        <div
          className="w-[15rem] 2xsm:w-[18rem] xsm:w-[22.5rem] sm:w-[30rem]
        -mr-[2rem] 2xsm:-mr-[2.4rem] xsm:-mr-[3rem] sm:-mr-[4rem]"
        >
          <Button
            disabled={!isAllFilled}
            handleClick={submitHandler}
            className="checkout-btn"
          >
            Pay
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BankCard;
