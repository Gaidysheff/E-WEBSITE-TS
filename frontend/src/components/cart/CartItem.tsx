import { Minus, Plus } from "lucide-react";
import Button from "@/components/uiComponents/Button";
// import Image from "@/assets/images/product/Product-1.png";
import { type Cartitem } from "@/lib/types.ts";
import { BASE_URL } from "@/api/api.ts";
import { NumericFormat } from "react-number-format";
import { useEffect, useState } from "react";
import { updateCartItemAction, deleteCartItemAction } from "@/api/actions.ts";
import DeleteModal from "@/components/uiComponents/DeleteModal.tsx";
import { useCart } from "@/store/CartContext.tsx";
import { toast } from "react-toastify";

interface Props {
  cartItem: Cartitem;
}

const CartItem = ({ cartItem }: Props) => {
  const { setCartItemsCount, refreshCart, updateLocalQuantity } = useCart();

  const subTotal = cartItem.sub_total;

  const [quantity, setQuantity] = useState<number>(cartItem.quantity);

  const increaseQuantityHandler = () => {
    // setQuantity((current) => current + 1);
    const newQty = quantity + 1;
    setQuantity(newQty);
    updateLocalQuantity(cartItem.id, newQty); // Магия синхронизации
  };

  const decreaseQuantityHandler = () => {
    // setQuantity((current) => current - 1);
    const newQty = quantity - 1;
    setQuantity(newQty);
    updateLocalQuantity(cartItem.id, newQty); // Магия синхронизации
  };

  const [cartItemUpdateLoader, setCartItemUpdateLoader] =
    useState<boolean>(false);

  // ================== Update CartItem Quantity ====================

  const updateCartItemHandler = async () => {
    setCartItemUpdateLoader(true);

    const formData = new FormData();
    formData.set("cartitem_id", String(cartItem.id));
    formData.set("quantity", String(quantity));
    const productName = cartItem.product.name;

    try {
      await updateCartItemAction(formData);
      toast.success(`Item - ${productName}'s quantity has been updated`);
      // toast.success("Selected item updated successfully!");
      refreshCart();
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      // Выключаем лоадер и при успехе, и при ошибке
      setCartItemUpdateLoader(false);
    }
  };

  // ================ Delete CartItem from the Cart =================

  const deleteCartItemHandler = async () => {
    const formData = new FormData();
    formData.set("item_id", String(cartItem.id));

    const productName = cartItem.product.name;

    try {
      await deleteCartItemAction(formData);
      toast.success(`Item - ${productName} has been deleted`);
      // toast.success("Selected item deleted successfully!");

      setCartItemsCount((current) => current - cartItem.quantity);

      refreshCart();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // const deleteCartItemHandler = () => {
  //   const formData = new FormData();
  //   formData.set("item_id", String(cartItem.id));

  //   const productName = cartItem.product.name;

  //   deleteCartItemAction(formData, productName);

  //   setCartItemsCount((current) => current - cartItem.quantity);

  //   // -------- Delay for reloading page ------------
  //   const reloadDelay = () => {
  //     window.location.reload();
  //   };
  //   setTimeout(reloadDelay, 2000);
  // };

  useEffect(() => {
    setQuantity(cartItem.quantity);
    // setSubTotal(cartItem.sub_total);
  }, [cartItem.quantity]); // Если в БД изменилось количество, обновляем ползунок

  return (
    <div
      className="flex items-center justify-between gap-2 lg:gap-4 xl:gap-6 
          border border-primaryLight py-4 mb-6 w-full flex-wrap bg-card px-4 
          rounded-lg shadow-xl"
    >
      <div
        className="flex items-center justify-between gap-2 lg:gap-4 xl:gap-6
          w-full flex-wrap"
      >
        {/* Line-1 */}
        <div className="flex items-center justify-between gap-6 lg:gap-4 xl:gap-6">
          {/* Product Image */}
          <div className="relative overflow-hidden w-[70px] h-[70px] rounded-lg">
            <img
              src={`${BASE_URL}${cartItem.product.image}`}
              alt="cartitem-img"
              className="object-cover"
            />
          </div>

          {/* Product Details - Name and Price */}
          <div className="flex-1 w-full">
            <p
              className="text-sm 2xsm:text-base sm:text-lg font-semibold 
                text-primaryDark leading-4 sm:leading-6"
            >
              {cartItem.product.name}
            </p>
            <p className="text-primary/50 text-sm mt-1">
              {cartItem.product.price}
            </p>
          </div>
        </div>
        {/* Line-2 */}
        <div className="flex items-center md:justify-end gap-2 xsm:gap-6 max-sm:mx-auto">
          {/* Quantity Selector */}
          <div
            className="flex items-center justify-center gap-2 px-2 py-1
                rounded-md"
          >
            {/* Decrease Quantity Button */}
            <button
              type="button"
              onClick={decreaseQuantityHandler}
              disabled={quantity == 1}
              className="p-1 2xsm:p-2 border border-primary/50 rounded-md 
                  bg-primaryLight/40 hover:bg-primaryLight/20 hover:border-primary/20
                  transition disabled:opacity-50 disabled:cursor-not-allowed
                  cursor-pointer"
            >
              <Minus
                className="w-[15px] h-[15px] 2xsm:w-5 2xsm:h-5
                    text-primaryDark"
              />
            </button>

            {/* Quantity Display */}
            <div
              className="w-[40px] h-[30px] 2xsm:w-[50px] 2xsm:h-[40px]
                  flex items-center justify-center text-sm xsm:text-xl bg-card
                  border border-primary/50 rounded-md shadow-sm"
            >
              {quantity}
            </div>

            {/* Increase Quantity Button */}
            <button
              type="button"
              onClick={increaseQuantityHandler}
              className="p-1 2xsm:p-2 border border-primary/50 rounded-md 
                  bg-primaryLight/40 hover:bg-primaryLight/20 hover:border-primary/20
                  transition disabled:opacity-50 disabled:cursor-not-allowed
                  cursor-pointer"
            >
              <Plus
                className="w-[15px] h-[15px] 2xsm:w-5 2xsm:h-5
                  text-primaryDark"
              />
            </button>
          </div>

          {/* Subtotal Price */}
          <p
            className="text-sm 2xsm:text-base sm:text-lg font-semibold 
              text-primaryDark"
          >
            {/* ${formattedSubTotal} */}
            <NumericFormat
              value={subTotal}
              displayType={"text"}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator=" "
              decimalSeparator="."
              prefix={"$ "}
              // suffix={" ₽"}
            />
          </p>

          {/* Remove Item Button */}
          <DeleteModal
            deleteCartItemHandler={deleteCartItemHandler}
            deleteCartitem={true}
          />
        </div>
      </div>
      {/* Update Cart Button */}
      <Button
        disabled={cartItemUpdateLoader}
        handleClick={updateCartItemHandler}
        className="update-item-btn ml-auto"
      >
        {cartItemUpdateLoader ? "Updating ..." : "Update Cart"}
      </Button>
    </div>
  );
};

export default CartItem;
