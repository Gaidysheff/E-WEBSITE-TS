import { BASE_URL } from "@/api/api";
import { type DeliveryOption } from "@/lib/types.ts";
import { cn } from "@/lib/utils";
import DeliveryOptionsSkeleton from "./DeliveryOptionsSkeleton.tsx";

interface Props {
  options: DeliveryOption[];
  selectedId: number | undefined;
  onSelect: (option: DeliveryOption) => void;
  loading: boolean;
}

const DeliveryOptions = ({ options, selectedId, onSelect, loading }: Props) => {
  // const numberCards = options.length;

  if (loading)
    return (
      <div className="grid sm:grid-cols-3 gap-4">
        {/* <div className="flex justify-center flex-wrap gap-3"> */}
        <DeliveryOptionsSkeleton cards={3} />
        {/* <DeliveryOptionsSkeleton cards={numberCards} /> */}
      </div>
    );

  return (
    // <div className="grid sm:grid-cols-3 gap-4">

    <div className="flex justify-center flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all text-center min-w-[150px]",
            selectedId === option.id
              ? "border-myMainColor bg-primaryLight/10 shadow-md"
              : "border-gray-100 hover:border-gray-300",
          )}
        >
          {/* Контент кнопки тот же самый */}
          {option.icon && (
            <img
              src={`${BASE_URL}${option.icon}`}
              alt={option.name}
              className="h-8 object-contain"
            />
          )}
          <div>
            <div className="font-bold text-sm">{option.name}</div>
            <div className="text-xs text-gray-500">{option.description}</div>
          </div>
          <div className="mt-auto font-bold text-primaryDark">
            {Number(option.price) === 0 ? "Free" : `${option.price} ₽`}
          </div>
        </button>
      ))}
    </div>
  );
};

export default DeliveryOptions;
