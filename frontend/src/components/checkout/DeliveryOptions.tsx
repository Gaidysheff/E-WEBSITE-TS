import { Package, Store, Truck } from "lucide-react";

import { cn } from "@/lib/utils";

export type DeliveryType = "courier" | "pickup" | "post";

type DeliveryOption = {
  id: DeliveryType;
  title: string;
  price: number;
  time: string;
  icon: any;
};

export const options: DeliveryOption[] = [
  { id: "pickup", title: "Self-Pickup", price: 0, time: "Today", icon: Store },
  {
    id: "courier",
    title: "Courier Delivery",
    price: 500,
    time: "Tomorrow",
    icon: Truck,
  },
  {
    id: "post",
    title: "Post / Boxberry",
    price: 350,
    time: "2-3 days",
    icon: Package,
  },
];

interface Props {
  selectedId: DeliveryType;
  onSelect: (option: DeliveryOption) => void;
}

const DeliveryOptions = ({ selectedId, onSelect }: Props) => {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedId === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all text-center",
              isSelected
                ? "border-myMainColor bg-primaryLight/10 shadow-md"
                : "border-gray-100 hover:border-gray-300",
            )}
          >
            <Icon
              className={cn(
                "size-6",
                isSelected ? "text-primaryDark" : "text-gray-400",
              )}
            />
            <div>
              <div className="font-bold text-sm">{option.title}</div>
              <div className="text-xs text-gray-500">{option.time}</div>
            </div>
            <div className="mt-auto font-bold text-primaryDark">
              {option.price === 0 ? "Free" : `${option.price} ₽`}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default DeliveryOptions;
