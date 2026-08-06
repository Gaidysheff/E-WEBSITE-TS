import Image from "@/assets/images/product/a_box.png";
import { BASE_URL } from "@/api/api";
// import { NumericFormat } from "react-number-format";
import { useCurrency } from "@/store/CurrencyContext";

import { type OrderItem, type WishList } from "@/lib/types.ts";
// import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/store/CartContext.tsx";
import { toast } from "react-toastify";
import { addToCartAction } from "@/api/actions.ts";
// import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AppLink as Link } from "@/components/appLink/AppLink";

interface Props {
  item: OrderItem | WishList;
  usedForOrder?: boolean;
}

const MiniProductCard = ({ item, usedForOrder }: Props) => {
  // / Внутри компонента MiniProductCard
  // const { lang } = useParams({
  //   from: "/$lang/_mainLayout/_authenticated/profile",
  // }); // укажите ваш точный путь профиля

  // const { lang } = useParams({ strict: false });

  const { formatPrice } = useCurrency();

  const { refreshCart, cartCode } = useCart();

  const handleBuyAgain = async () => {
    try {
      toast.loading(`Добавляем ${item.product.name}...`);

      const formData = new FormData();
      formData.set("product_id", String(item.product.id));
      formData.set("cart_code", cartCode);

      // formData.set("quantity", "1");

      await addToCartAction(formData);

      toast.dismiss();
      toast.success(`${item.product.name} добавлен в корзину!`);
      refreshCart();
    } catch (error) {
      toast.dismiss();
      toast.error("Ошибка при добавлении товара.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Link
        // <Link
        //   to="/$lang/products/$productId"
        //   params={{
        //     lang: lang,
        //     productId: item.product.slug,
        //   }}
        to={`/products/${item.product.slug}`}
        className="w-[150px] sm:w-[220px] rounded-lg shadow-md bg-card 
        flex flex-col items-center gap-3 px-4 py-5 transition-all duration-300 
        hover:shadow-lg hover:scale-105 cursor-pointer border border-gray-400"
      >
        <div
          className="w-[100px] h-[100px] sm:w-[160px] sm:h-[160px] rounded-md
          overflow-hidden"
        >
          <img
            src={
              item.product.image
                ? `${BASE_URL}${item.product.image}`
                : `${Image}`
            }
            className="object-cover w-full h-full"
            width={160}
            height={160}
            alt="thumbnail"
          />
        </div>

        {/* Product Name */}
        <p
          className="text-center text-xs sm:text-base font-medium
          text-primaryDark"
        >
          {item.product.name}
        </p>

        {/* Product Price */}
        <p
          className="text-xs sm:text-base text-center font-bold 
          text-primaryDark"
        >
          {formatPrice(item.product.price)}

          {/* <NumericFormat
            value={item.product.price}
            displayType={"text"}
            thousandSeparator="."
            decimalSeparator=","
            prefix={"$ "}
            // suffix={" ₽"}
          /> */}
        </p>
      </Link>

      {/* Кнопка действия под карточкой */}
      {usedForOrder ? (
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-myMainColor text-myMainColor
          hover:bg-myMainColor/10 rounded-xl"
          onClick={handleBuyAgain}
        >
          Купить снова
        </Button>
      ) : (
        // Если это Wishlist (usedForOrder === false или undefined)
        <Button
          variant="default"
          // Сделаем её залитой основным цветом для призыва к действию
          size="sm"
          className="text-xs bg-myMainColor text-white
          hover:bg-myMainColorDark rounded-xl"
          onClick={handleBuyAgain}
        >
          В корзину
        </Button>
      )}
    </div>
  );
};

export default MiniProductCard;
