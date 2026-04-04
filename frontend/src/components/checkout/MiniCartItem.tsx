import { BASE_URL } from "@/api/api";
import { type Cartitem } from "@/lib/types.ts";

interface Props {
  cartItem: Cartitem;
}

const MiniCartItem = ({ cartItem }: Props) => {
  const subTotal = cartItem.product.price * cartItem.quantity;

  return (
    <div
      className="flex items-center justify-between gap-4 py-3 border-b
			border-gray-100 last:border-0"
    >
      <div className="flex items-center gap-4">
        {/* Компактное изображение с бейджем количества */}
        <div className="relative flex-shrink-0">
          <div
            className="w-16 h-16 rounded-lg overflow-hidden border
						border-gray-100 shadow-sm"
          >
            <img
              src={`${BASE_URL}${cartItem.product.image}`}
              alt={cartItem.product.name}
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <span
            className="absolute -top-2 -right-2 bg-primaryDark
						text-white text-[10px] font-bold w-5 h-5 border-2 border-white
						flex items-center justify-center rounded-full"
          >
            {cartItem.quantity}
          </span>
        </div>

        {/* Название и цена за шт. */}
        <div>
          <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
            {cartItem.product.name}
          </h4>
          <p className="text-xs text-gray-400">
            {cartItem.product.price} ₽ / unit
          </p>
        </div>
      </div>

      {/* Итоговая сумма за позицию */}
      <div className="text-sm font-semibold text-primaryDark">{subTotal} ₽</div>
    </div>
  );
};

export default MiniCartItem;
