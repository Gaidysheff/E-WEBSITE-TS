import { BASE_URL } from "@/api/api";
import Button from "@/components/uiComponents/Button";
import WishlistTooltip from "@/components/uiComponents/WishlistTooltip.tsx";
import { type Product } from "@/lib/types.ts";
import { useCart } from "@/store/CartContext.tsx";
import { useEffect, useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";

// import { NumericFormat } from "react-number-format";
import { useCurrency } from "@/store/CurrencyContext";

import {
  addToCartAction,
  isProductInCartAction,
  isProductInWishlistAction,
  wishlistAddAndDeleteAction,
} from "@/api/actions.ts";
import { useUser } from "@/store/UserContext.tsx";
import { useParams } from "@tanstack/react-router";
import { toast } from "react-toastify";

interface Props {
  product: Product;
  isAuthorized: boolean;
}

const ProductInfo = ({ product, isAuthorized }: Props) => {
  const { LL } = useI18nContext();

  const { formatPrice } = useCurrency();

  // Вытаскиваем живой параметр lang из URL роутера
  const { lang } = useParams({ from: "/$lang" });
  // console.log("🚀 ~ ProductInfo ~ product:", product);

  const { user } = useUser();
  const email = typeof user === "undefined" ? "" : user.email;

  const { cartCode, setCartItemsCount, refreshCart } = useCart();

  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState<boolean>(false);

  const [isLoadingWishlist, setIsLoadingWishlist] = useState<boolean>(false);

  // ----------- Add Product to the Cart ------------------------
  const handleAddToCart = async () => {
    setAddToCartLoader(true);

    const formData = new FormData();
    formData.set("cart_code", cartCode);
    formData.set("product_id", String(product.id));

    try {
      await addToCartAction(formData);
      toast.success(`${LL.productSection.toastCartSuccess()}`);
      // toast.success("Selected item added successfully!");
      refreshCart(); // Обновляем данные в стейте без перезагрузки всей страницы!
      setCartItemsCount((current: number) => current + 1);
      setIsAddedToCart(true);
    } catch (error) {
      toast.error(`${LL.productSection.toastError()}`);
      // toast.error("Something went wrong");
      throw error;
    } finally {
      // Выключаем лоадер и при успехе, и при ошибке
      setAddToCartLoader(false);
    }
    // ------ Delay for disabling the button ---------
    // const reloadDelay = () => {
    //   setAddToCartLoader(false);
    // };
    // setTimeout(reloadDelay, 3000);
  };

  // ----------- Is Product in the Cart ? ------------------------

  const handleIsProductInCart = async () => {
    try {
      const response = await isProductInCartAction(
        cartCode,
        String(product.id),
      );
      setIsAddedToCart(response.data.product_in_cart);
    } catch (error) {
      console.log("🚀 ~ handleIsProductInCart ~ error:", error);
    }
  };

  useEffect(() => {
    handleIsProductInCart();
  }, [cartCode, product.id]);

  // ----------- WishList - Add & Delete ------------------------
  const handleWishlistAddAndDelete = async () => {
    setIsLoadingWishlist(true);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("product_id", String(product.id));

    try {
      await wishlistAddAndDeleteAction(formData);
      setIsAddedToWishlist((current) => !current);

      if (isAddedToWishlist) {
        toast.info(`${LL.productSection.toastWishlistInfo()}`);
        // toast.info("Item removed from your Wishlist successfully!");
      } else {
        toast.success(`${LL.productSection.toastWishlistSuccess()}`);
        // toast.success("Item added to your Wishlist successfully!");
      }
    } catch (error) {
      toast.error(`${LL.productSection.toastError()}`);
      // toast.error("Something went wrong");
      throw error;
    } finally {
      setIsLoadingWishlist(false);

      // -------- Delay for showing toaster ------------
      // const reloadDelay = () => {
      //   setIsLoadingWishlist(false);
      // };
      // setTimeout(reloadDelay, 3000);
    }
  };

  // ---------- Is the Product in the WishList ? -------------

  const handleIsProductInWishlist = async () => {
    if (isAuthorized) {
      try {
        const response = await isProductInWishlistAction(email, product.id);
        setIsAddedToWishlist(response.data.product_in_wishlist);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
      }
    }
  };

  useEffect(() => {
    handleIsProductInWishlist();
  }, [email, product.id]);

  return (
    <div
      className="py-10 md:pt-20 flex items-start flex-wrap md:grid 
    md:grid-cols-8 gap-6"
    >
      {/* Product Image */}
      <div
        className="bg-card md:col-span-3 relative overflow-hidden rounded-lg
        max-md:mt-10 p-3 xsm:p-10 md:p-3 shadow-sm border border-gray-200"
      >
        {!product.is_available && (
          <div
            className="block absolute mt-[25%] xsm:mt-[30%] text-center
                      flex flex-col z-40 top-0 inset-x-0 py-1 xsm:py-4 
                      bg-gray-400/20 dark:bg-gray-300/20 
                      backdrop-grayscale backdrop-blur-xl"
          >
            <span
              className="font-semibold italic text-myMainColor/70
                      z-50 drop-shadow-[2px_2px_1px_rgba(255,255,255,.9)]
                      text-base sm:text-xl md:text-base lg:text-xl"
            >
              Нет в наличии
            </span>
            <span
              className="font-semibold italic text-myMainColor/70
                      z-50 drop-shadow-[2px_2px_1px_rgba(255,255,255,.9)]
                      text-sm sm:text-xl md:text-base lg:text-xl"
            >
              Ожидаем в ближайшее время
            </span>
          </div>
        )}
        <img
          src={`${BASE_URL}${product.image}`}
          alt="product image"
          className="w-full sm:w-[75%] md:w-full object-cover rounded-lg mx-auto"
        />
      </div>

      {/* Product Info */}
      <div className="md:col-span-5 w-full max-md:mt-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-primaryDark">
            {product.name}
          </h1>
          <h3 className="text-xl sm:text-2xl font-semibold text-primaryDark">
            {formatPrice(product.price)}

            {/* <NumericFormat
              value={product?.price}
              displayType={"text"}
              thousandSeparator="."
              decimalSeparator=","
              prefix={"$ "}
              // suffix={" ₽"}
            /> */}
          </h3>
        </div>

        {/* Product Details */}
        <div>
          <h3 className="text-lg sm:text-xl text-primaryDark my-3">
            {LL.productSection.details()}
            {/* Details: */}
          </h3>
          <p
            className="text-primaryDark text-justify md:leading-6 text-base
            max-sm:text-sm mb-10 text-justify hyphens-auto break-words"
            lang={lang}
          >
            {/* {product.description} */}
            {product.description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex py-3 items-center gap-4 flex-wrap">
          <Button
            disabled={addToCartLoader || isAddedToCart || !product.is_available}
            handleClick={handleAddToCart}
            className="product-btn 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addToCartLoader
              ? `${LL.productSection.adding()}`
              : isAddedToCart
                ? `${LL.productSection.added()}`
                : `${LL.productSection.addCart()}`}
          </Button>

          {isAuthorized ? (
            <Button
              disabled={isLoadingWishlist}
              handleClick={handleWishlistAddAndDelete}
              className="wish-btn
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddedToWishlist
                ? isLoadingWishlist
                  ? `${LL.productSection.updating()}`
                  : `${LL.productSection.remove()}`
                : isLoadingWishlist
                  ? `${LL.productSection.updating()}`
                  : `${LL.productSection.addWishlist()}`}
            </Button>
          ) : (
            <WishlistTooltip />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
