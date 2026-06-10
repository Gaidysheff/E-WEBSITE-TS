import { Star } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { type RatingStats } from "@/lib/types.ts";
import { useI18nContext } from "@/i18n/i18n-react";

interface Props {
  currentRating: number | undefined;
  handleRatingChange: (rating: number | undefined) => void;
  // stats: Record<string, number> | undefined; // Данные от бэкенда
  stats: RatingStats | undefined;
}

const RatingFilter = ({ currentRating, handleRatingChange, stats }: Props) => {
  const { LL } = useI18nContext();
  const ratingConfig = [
    { value: 4, key: "four_plus" },
    { value: 3, key: "three_plus" },
    { value: 2, key: "two_plus" },
    { value: 1, key: "one_plus" },
  ];

  return (
    <div className="flex flex-col gap-2 my-4">
      <div className="font-semibold italic text-myMainColor">
        {LL.filter.reviews()}
        {/* Customer Reviews */}
      </div>
      {ratingConfig.map((cfg) => {
        const count = stats ? stats[cfg.key as keyof typeof stats] : 0;
        const isActive = currentRating === cfg.value;

        return (
          <button
            key={cfg.value}
            disabled={count === 0} // Отключаем, если таких товаров нет
            type="button"
            onClick={() => handleRatingChange(isActive ? undefined : cfg.value)}
            className={cn(
              "flex items-center gap-2 group transition-all",
              count === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:translate-x-1",
              isActive && "scale-105",
            )}
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={cn(
                    star <= cfg.value
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <span
              className={cn(
                "text-sm",
                isActive ? "text-myMainColor font-bold" : "text-gray-600",
              )}
            >
              {LL.filter.up()} {/* & Up  */}
              <span className="text-gray-400 font-normal">({count})</span>
            </span>
          </button>
        );
      })}
      {/* Кнопка сброса только для рейтинга, если он выбран */}
      {currentRating && (
        <button
          type="button"
          onClick={() => handleRatingChange(undefined)}
          className="text-xs text-gray-400 hover:text-red-500 text-left mt-1"
        >
          Clear rating filter
        </button>
      )}
    </div>
  );
};

export default RatingFilter;
