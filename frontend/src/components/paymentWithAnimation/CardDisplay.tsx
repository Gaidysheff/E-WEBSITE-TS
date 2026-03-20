import CardLogo from "./CardLogo.tsx";
import CardNumber from "./CardNumber.tsx";
import CardVerificationCode from "./CardVerificationCode.tsx";
import Expiration from "./Expiration.tsx";
import HolderName from "./HolderName.tsx";
import { cn } from "@/lib/utils.ts";

type Props = {
  isFlipped: boolean;
  cardType: string;
  formValues: {
    cardNumber: string;
    userName: string;
    cvc: string;
    month: string;
    year: string;
  };
  monthTouched: boolean | undefined;
  yearTouched: boolean | undefined;
};

const CardDisplay = ({
  isFlipped,
  cardType,
  formValues,

  monthTouched,
  yearTouched,
}: Props) => {
  return (
    <div
      className={cn(
        "transition transform-3d ease-in-out duration-800 relative text-white w-[26rem] h-[16.5rem]",
        isFlipped ? "rotate-y-180" : "",
      )}
    >
      {/* --------- Front side of the card --------- */}
      <div
        className="backface-hidden !absolute !inset-0 w-full h-full
            bg-myMainColorDark border-2 border-myMainColorDarker rounded-2xl p-8
            flex flex-col gap-2 z-1 overflow-hidden relative card-container
            before:content-[''] before:absolute before:h-[600px] before:w-[600px]
            before:rounded-[100%] before:bg-myMainColorLighter/50 before:-z-1
            before:-top-[380px] before:-left-[250px]
            after:content-[''] after:absolute after:h-[700px] after:w-[700px]
            after:rounded-[100%] after:bg-myMainColorLight/50 after:-z-1
            after:-bottom-[520px] after:-left-[200px]"
      >
        <div className="card-shine pointer-events-none" />
        <CardLogo cardType={cardType} />

        <CardNumber value={formValues.cardNumber} />

        <div className="flex justify-between gap-2">
          <HolderName value={formValues.userName} />

          <Expiration
            month={formValues.month}
            year={formValues.year}
            monthTouched={monthTouched}
            yearTouched={yearTouched}
          />
        </div>
      </div>
      {/* --------- Back side of the card --------- */}
      <div
        className="backface-hidden absolute absolute inset-0 w-full h-full rotate-y-180
            bg-myMainColorDark border-2 border-myMainColorDarker rounded-2xl p-8
            flex flex-col gap-2 z-1 overflow-hidden relative
            before:content-[''] before:absolute before:h-[600px] before:w-[600px]
            before:rounded-[100%] before:bg-myMainColorLighter/50 before:-z-1
            before:-top-[380px] before:-left-[250px]
            after:content-[''] after:absolute after:h-[700px] after:w-[700px]
            after:rounded-[100%] after:bg-myMainColorLight/50 after:-z-1
            after:-bottom-[520px] after:-left-[200px]"
      >
        <div className="bg-black absolute left-0 right-0 top-[1.5rem] h-[3.75rem]"></div>

        <CardVerificationCode value={formValues.cvc} />
      </div>
    </div>
  );
};

export default CardDisplay;
