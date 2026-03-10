import CardLogo from "./CardLogo.tsx";
import CardNumber from "./CardNumber.tsx";
import CardVerificationCode from "./CardVerificationCode.tsx";
import Expiration from "./Expiration.tsx";
import HolderName from "./HolderName.tsx";
import { cn } from "@/lib/utils.ts";

type Props = {
  isFlipped: boolean;
  cardType: string;
};

const CardDisplay = ({ isFlipped, cardType }: Props) => {
  return (
    <div
      className={cn(
        "transition transform-3d ease-in-out duration-800 relative w-[26rem] h-[16.5rem] text-white",
        isFlipped ? "rotate-y-180" : "",
      )}
    >
      {/* --------- Front side of the card --------- */}
      <div
        className="w-[26rem] h-[16.5rem] backface-hidden absolute
          bg-myMainColorDark border-2 border-myMainColorDarker rounded-2xl p-8
          flex flex-col gap-1 sm:gap-2 z-1 overflow-hidden relative
          before:content-[''] before:absolute before:h-[600px] before:w-[600px]
          before:rounded-[100%] before:bg-myMainColorLighter/50 before:-z-1
          before:-top-[380px] before:-left-[250px]
          after:content-[''] after:absolute after:h-[700px] after:w-[700px]
          after:rounded-[100%] after:bg-myMainColorLight/50 after:-z-1
          after:-bottom-[520px] after:-left-[200px] card-front"
      >
        <CardLogo cardType={cardType} />
        <CardNumber />
        <div className="flex justify-between gap-2">
          <HolderName />
          <Expiration />
        </div>
      </div>
      {/* --------- Back side of the card --------- */}
      <div
        className="w-[26rem] h-[16.5rem] backface-hidden absolute rotate-y-180 left-0
          bg-myMainColorDark border-2 border-myMainColorDarker rounded-2xl p-8
          flex flex-col gap-1 sm:gap-2 z-1 overflow-hidden relative
          before:content-[''] before:absolute before:h-[600px] before:w-[600px]
          before:rounded-[100%] before:bg-myMainColorLighter/50 before:-z-1
          before:-top-[380px] before:-left-[250px]
          after:content-[''] after:absolute after:h-[700px] after:w-[700px]
          after:rounded-[100%] after:bg-myMainColorLight/50 after:-z-1
          after:-bottom-[520px] after:-left-[200px]"
      >
        <div
          className="bg-black absolute left-0 right-0 top-[1.5rem]
            h-[1.875rem] 2xsm:h-[2.25rem] xsm:h-[2.8125rem] sm:h-[3.75rem]"
        ></div>
        <CardVerificationCode />
      </div>
    </div>
  );
};

export default CardDisplay;
