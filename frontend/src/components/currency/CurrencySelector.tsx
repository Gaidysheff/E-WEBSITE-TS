import { type CurrencyType, useCurrency } from "@/store/CurrencyContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1.5">
      <Select
        value={currency}
        onValueChange={(value) => setCurrency(value as CurrencyType)}
      >
        <SelectTrigger
          className="w-[55px] h-9 font-medium border-input
          bg-background text-foreground"
        >
          <SelectValue placeholder="Валюта" />
        </SelectTrigger>
        <SelectContent align="end" className="dark:bg-zinc-950">
          <SelectItem value="RUB" className="cursor-pointer">
            ₽{/* RUB (₽) */}
          </SelectItem>
          <SelectItem value="USD" className="cursor-pointer">
            ${/* USD ($) */}
          </SelectItem>
          <SelectItem value="EUR" className="cursor-pointer">
            €{/* EUR (€) */}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
