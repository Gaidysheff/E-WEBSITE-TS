import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";

interface Props {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  isCompleted?: boolean;
  className?: string;
}

const CheckoutSection = ({
  title,
  icon,
  children,
  isCompleted,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 p-6 shadow-sm relative z-10",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primaryLighter rounded-lg text-primaryDark">
            {icon}
          </div>
          <h2 className="text-base 2xsm:text-lg sm:text-xl font-bold text-primaryDark">
            {title}
          </h2>
        </div>
        {isCompleted && (
          <span className="text-green-500 text-sm font-medium flex items-center gap-1">
            <BadgeCheck className="size-6" /> Done
          </span>
        )}
      </div>
      <div className="sm:pl-11">
        {" "}
        {/* Сдвиг контента, чтобы он был под заголовком */}
        {children}
      </div>
    </div>
  );
};

export default CheckoutSection;
