import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ReactNode } from "react";
import { type BankCardSchemaType } from "./BankCard.tsx";

interface Props {
  cvc: string;
  onFieldChange: (field: keyof BankCardSchemaType, value: string) => void;
  error?: ReactNode | null; // Новый пропс для ошибки
}

const CardVerificationCode = ({ cvc, onFieldChange, error }: Props) => {
  return (
    <div
      className="flex flex-col justify-between gap-1 sm:gap-2 absolute 
      bottom-[1.95rem] 2xsm:bottom-[2.2rem] xsm:bottom-[3rem] sm:bottom-[3.9rem]
      right-[0.1rem] sm:right-[0.5rem]"
    >
      <label
        htmlFor="cvc"
        className="uppercase text-[0.5rem] 2xsm:text-[0.525rem]
        xsm:text-[0.66rem] sm:text-sm"
      >
        CVC
      </label>

      <TooltipProvider>
        {/* Открываем тултип, только если есть текст ошибки */}
        <Tooltip open={!!error}>
          <TooltipTrigger asChild>
            {/* ИСХОДНЫЙ ИНПУТ */}
            <input
              type="password"
              inputMode="numeric"
              maxLength={3}
              id="cvc"
              value={cvc}
              onChange={(e) => onFieldChange("cvc", e.target.value)}
              required
              className="bg-white text-myMainColorDarker rounded-xs sm:p-1
              font-mono w-[4ch] mr-2 text-center
              text-[0.5rem] 2xsm:text-[0.525rem] xsm:text-[0.6562rem] sm:text-sm
              h-[1rem] 2xsm:h-[1.2rem] xsm:h-[1.65rem] sm:h-[2.2rem]
              focus:outline-white focus:outline-1 focus:outline-offset-1
              2xsm:focus:outline-2 2xsm:focus:outline-offset-2
              sm:focus:outline-3 sm:focus:outline-offset-3"
            />
          </TooltipTrigger>

          {/* Контент тултипа */}
          <TooltipContent
            side="top"
            // className="bg-black text-white"
          >
            {error}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CardVerificationCode;
