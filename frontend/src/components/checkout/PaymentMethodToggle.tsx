import { CreditCard, SmartphoneNfc, Zap } from "lucide-react";
import { type PaymentMethod } from "@/lib/types.ts";
import { cn } from "@/lib/utils";

interface Props {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodToggle = ({ selected, onSelect }: Props) => {
  const methods = [
    { id: "card", title: "Bank Card", icon: CreditCard },
    { id: "sbp", title: "SBP", icon: Zap },
    { id: "yandex", title: "Yandex Pay", icon: SmartphoneNfc },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-11">
      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onSelect(m.id)}
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
            selected === m.id
              ? "border-myMainColor bg-primaryLight/10 shadow-sm"
              : "border-gray-100 hover:border-gray-200",
          )}
        >
          <m.icon
            className={cn(
              "size-5",
              selected === m.id ? "text-primaryDark" : "text-gray-400",
            )}
          />
          <span className="font-medium text-sm">{m.title}</span>
        </button>
      ))}
    </div>
  );
};

export default PaymentMethodToggle;
