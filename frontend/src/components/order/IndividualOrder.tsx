import MiniProductCard from "./MiniProductCard";
import { type Order } from "@/lib/types.ts";
import { timeAgo } from "@/lib/utilities.ts";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/store/CartContext.tsx";
import { toast } from "react-toastify";
import { addToCartAction } from "@/api/actions.ts";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
// import { userOrdersOptions } from "@/api/queryOptions/userOrdersOptions.ts";
interface Props {
  order: Order;
}

const IndividualOrder = ({ order }: Props) => {
  const orderItems = order.items;

  const { refreshCart, cartCode } = useCart();
  // console.log("🚀 ~ IndividualOrder ~ cartCode:", cartCode);
  const navigate = useNavigate();

  const handleRepeatOrder = async () => {
    try {
      toast.loading("Переносим товары в корзину...");

      // Проходим циклом по всем товарам из старого заказа
      for (const item of orderItems) {
        const formData = new FormData();
        formData.set("product_id", String(item.product.id));
        formData.set("cart_code", cartCode);
        // formData.set("quantity", String(item.quantity));

        // Вызываем ваш стандартный экшен добавления в корзину
        await addToCartAction(formData);
      }

      toast.dismiss();
      toast.success("Товары успешно добавлены в корзину! 🛒");

      refreshCart(); // Обновляем стейт корзины в шапке
      navigate({ to: `/cart/${cartCode}` });
      // Телепортируем пользователя в корзину
    } catch (error) {
      toast.dismiss();
      toast.error("Не удалось повторить заказ. Попробуйте вручную.");
    }
  };

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
            {order.checkout_id.slice(0, 22)}
            {/* {order.stripe_checkout_id.slice(0, 22)} */}
          </span>
        </p>
        <Button
          variant="outline"
          size="icon" // Круглая или квадратная кнопка под иконку в Shadcn
          className="border-myMainColor text-myMainColor hover:bg-myMainColor/10
          rounded-full"
          onClick={handleRepeatOrder}
          title="Повторить заказ целиком"
        >
          <ShoppingCart className="size-4" />
        </Button>
        <small className="text-primaryDark text-xs sm:text-sm">
          {timeAgo(order.created_at)}
        </small>
      </div>

      {/* Order Items */}
      <div className="w-full py-4 flex items-center gap-4 custom-overflow">
        {orderItems &&
          orderItems.map((orderItem) => (
            <MiniProductCard key={orderItem.id} item={orderItem} usedForOrder />
          ))}
      </div>
    </div>
  );
};

export default IndividualOrder;
