import Button from "@/components/uiComponents/Button";
import { type Product } from "@/lib/types.ts";
import { BASE_URL } from "@/api/api";
import { NumericFormat } from "react-number-format";
import { useCart } from "@/store/CartContext.tsx";
import { useEffect, useState } from "react";
import {
  CART_PRODUCT_ADDED_URL,
  WISHLIST_PRODUCT_ADDED_URL,
} from "@/api/endpoints.ts";
import api from "@/api/api.ts";
import WishlistTooltip from "@/components/uiComponents/WishlistTooltip.tsx";

import { useUser } from "@/store/UserContext.tsx";
import { addToCartAction, wishlistAddAndDeleteAction } from "@/api/actions.ts";

import { toast } from "react-toastify";

interface Props {
  product: Product;
  isAuthorized: boolean;
}

const ProductInfo = ({ product, isAuthorized }: Props) => {
  const { user } = useUser();
  console.log("🚀 ~ ProductInfo ~ user:", user);

  const email = typeof user === "undefined" ? "" : user.email;
  // const userId: number | undefined = user?.id;

  const { cartCode, setCartItemsCount } = useCart();

  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState<boolean>(false);
  // console.log("🚀 ~ ProductInfo ~ isAddedToWishlist:", isAddedToWishlist);

  const [isLoadingWishlist, setIsLoadingWishlist] = useState<boolean>(false);

  // ----------- Add Product to the Cart ------------------------

  const handleAddToCart = () => {
    setAddToCartLoader(true);

    const formData = new FormData();
    formData.set("cart_code", cartCode);
    // formData.set("user", userId);
    // formData.set("cart_code", cartCode ? cartCode : "");
    formData.set("product_id", String(product.id));

    addToCartAction(formData);

    setIsAddedToCart(true);

    setCartItemsCount((current: number) => current + 1);

    // ------ Delay for disabling the button ---------
    const reloadDelay = () => {
      setAddToCartLoader(false);
    };
    setTimeout(reloadDelay, 3000);
  };

  // ----------- Is the Product in the Cart ? ------------------------
  const handleIsProductInCart = async () => {
    try {
      await api
        .get(
          `${CART_PRODUCT_ADDED_URL}?cart_code=${cartCode}&product_id=${product.id}`,
        )
        .then((response) => {
          setIsAddedToCart(response.data.product_in_cart);
          // console.log("🚀 ~ handleIsProductInCart ~ response:", response);
          return response;
        });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occured");
    }
  };

  useEffect(() => {
    handleIsProductInCart();
  }, [cartCode, product.id]);

  // ----------- WishList - Add & Delete ------------------------
  const handleWishlistAddAndDelete = () => {
    setIsLoadingWishlist(true);

    const formData = new FormData();
    formData.set("email", typeof email !== "undefined" ? email : "");
    formData.set("product_id", String(product.id));

    wishlistAddAndDeleteAction(formData);

    setIsAddedToWishlist((current) => !current);

    if (isAddedToWishlist) {
      toast.info("Item removed from your Wishlist successfully!");
    } else {
      toast.success("Item added to your Wishlist successfully!");
    }
    // -------- Delay for showing toaster ------------
    const reloadDelay = () => {
      setIsLoadingWishlist(false);
    };
    setTimeout(reloadDelay, 3000);
  };

  // ---------- Is the Product in the WishList ? -------------

  const handleIsProductInWishlist = async () => {
    if (isAuthorized) {
      try {
        await api
          .get(
            `${WISHLIST_PRODUCT_ADDED_URL}?email=${email}&product_id=${product.id}`,
          )
          .then((response) => {
            setIsAddedToWishlist(response.data.product_in_wishlist);
            return response;
          });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("An unknown error occured");
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
            <NumericFormat
              value={product?.price}
              displayType={"text"}
              thousandSeparator="."
              decimalSeparator=","
              prefix={"$ "}
              // suffix={" ₽"}
            />
          </h3>
        </div>

        {/* Product Details */}
        <div>
          <h3 className="text-lg sm:text-xl text-primaryDark my-3">Details:</h3>
          <p
            className="text-primaryDark text-justify md:leading-6 text-base
            max-sm:text-sm mb-10"
          >
            {/* {product.description} */}
            {product.description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex py-3 items-center gap-4 flex-wrap">
          <Button
            disabled={addToCartLoader || isAddedToCart}
            handleClick={handleAddToCart}
            className="product-btn 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addToCartLoader
              ? "Adding to Cart ..."
              : isAddedToCart
                ? "Added to Cart"
                : "Add to Cart"}
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
                  ? "Updating ..."
                  : "Remove from Wishlist"
                : isLoadingWishlist
                  ? "Updating ..."
                  : "Add to Wishlist"}
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
