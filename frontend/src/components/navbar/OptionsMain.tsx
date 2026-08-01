import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui-modified/tooltip";

import FilterDrawer from "@/components/filter/FilterDrawer.tsx";
import { LayoutGrid } from "lucide-react";
import { AppLink as Link } from "@/components/appLink/AppLink";
import SettingsDrawer from "@/components/settings/SettingsDrawer.tsx";

const OptionsMain = () => {
  return (
    <div
      className="flex justify-start items-center gap-4
      max-md:w-full max-md:justify-around"
    >
      {/* -------------------------------------- */}

      <Tooltip>
        <TooltipTrigger
          className="text-primaryDark hover:text-primaryDark/50
          hover:scale-110 transition duration-300 w-[40px]"
        >
          <Link
            to="/products"
            search={{ isCatalog: true }}
            // className="text-primaryDark hover:text-primaryDark/50
            //             hover:scale-110 transition duration-300 w-[40px]"
          >
            <LayoutGrid size={40} />
          </Link>
        </TooltipTrigger>

        <TooltipContent mainColorTooltip side="bottom">
          <p>Каталог</p>
        </TooltipContent>
      </Tooltip>

      {/* -------------------------------------- */}

      <Tooltip>
        <TooltipTrigger>
          <SettingsDrawer />
        </TooltipTrigger>
        <TooltipContent mainColorTooltip side="bottom">
          <p>Настройки</p>
        </TooltipContent>
      </Tooltip>

      {/* -------------------------------------- */}

      <Tooltip>
        <TooltipTrigger>
          <FilterDrawer />
        </TooltipTrigger>
        <TooltipContent mainColorTooltip side="bottom">
          <p>Фильтрация товара</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default OptionsMain;
