import MiniProductCard from "./MiniProductCard";
import { type Order } from "@/lib/types.ts";
import { timeAgo } from "@/lib/utils.ts";

interface Props {
  order: Order;
}

const IndividualOrder = ({ order }: Props) => {
  const orderItems = order.items;

  return (
    <div
      className="w-full border border-gray-400 bg-card px-4 py-4 rounded-lg
      shadow-sm"
    >
      {/* Order Header */}
      <div
        className="w-full bg-card px-4 py-3 rounded-md
        flex items-center justify-between shadow-sm border border-gray-400"
      >
        <p
          className="text-sm sm:text-base font-medium text-primaryDark
          max-2xsm:hidden"
        >
          ORDER ID:{" "}
          <span className="text-green-600 font-semibold">
            {order.stripe_checkout_id.slice(0, 22)}
          </span>
        </p>
        <small className="text-primaryDark text-xs sm:text-sm">
          {timeAgo(order.created_at)}
        </small>
      </div>

      {/* Order Items */}
      <div className="w-full py-4 flex items-center gap-4 custom-overflow">
        {orderItems &&
          orderItems.map((orderItem) => (
            <MiniProductCard key={orderItem.id} item={orderItem} />
          ))}
      </div>
    </div>
  );
};

export default IndividualOrder;
