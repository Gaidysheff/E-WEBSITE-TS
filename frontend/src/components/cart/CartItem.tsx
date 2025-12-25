import { Minus, Plus, X } from "lucide-react";

import Button from "@/components/uiComponents/Button";
import Image from "@/assets/images/product/Product-1.png";

const CartItem = () => {
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
            <img src={Image} alt="cartitem-img" className="object-cover" />
          </div>

          {/* Product Details - Name and Price */}
          <div className="flex-1 w-full">
            <p
              className="text-sm 2xsm:text-base sm:text-lg font-semibold 
                text-primaryDark leading-4 sm:leading-6"
            >
              Apple Smart Watch
            </p>
            <p className="text-primary/50 text-sm mt-1">$ 200.00</p>
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
              33
            </div>

            {/* Increase Quantity Button */}
            <button
              type="button"
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
            $ 100.00
          </p>

          {/* Remove Item Button */}

          <button
            type="button"
            className="p-1 2xsm:p-2 rounded-md bg-red-500/20 hover:bg-red-100 
                transition text-red-500 border border-red-300 cursor-pointer"
          >
            <X className="w-[15px] h-[15px] 2xsm:w-5 2xsm:h-5" />
          </button>
        </div>
      </div>
      {/* Update Cart Button */}
      <Button className="update-item-btn ml-auto">Update Cart</Button>
    </div>
  );
};

export default CartItem;
