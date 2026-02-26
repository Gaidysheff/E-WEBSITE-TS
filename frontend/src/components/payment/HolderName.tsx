import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ReactNode } from "react";

interface Props {
  userName: string;
  getName: (value: string) => void;
  error?: ReactNode | null; // Новый пропс для ошибки
}

const HolderName = ({ userName, getName, error }: Props) => {
  return (
    <fieldset className="flex flex-col gap-1 sm:gap-2">
      <label
        htmlFor="card-name"
        className="uppercase text-[0.5rem] 2xsm:text-[0.525rem]
        xsm:text-[0.66rem] sm:text-sm"
      >
        Cardholder Name
      </label>
      <TooltipProvider>
        {/* Открываем тултип, только если есть текст ошибки */}
        <Tooltip open={!!error}>
          <TooltipTrigger asChild>
            {/* ИСХОДНЫЙ ИНПУТ */}
            <input
              id="card-name"
              type="text"
              value={userName}
              onChange={(e) => getName(e.target.value)}
              required
              className="bg-white text-myMainColorDarker rounded-xs p-1
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
            // style={{ whiteSpace: "pre-line" }}
          >
            {error}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </fieldset>
  );
};
export default HolderName;
