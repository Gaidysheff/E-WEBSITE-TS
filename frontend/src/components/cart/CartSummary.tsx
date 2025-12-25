import Button from "@/components/uiComponents/Button";

const CartSummary = () => {
  return (
    <div
      className="xl:w-[400px] max-lg:w-full border border-primaryDark
      rounded-lg shadow-xl bg-card px-8 py-6"
    >
      <h2 className="font-semibold text-2xl text-primaryDark mb-6">
        Order Summary
      </h2>

      <div className="w-full flex items-center justify-between py-2">
        <p className="text-primary text-sm 2xsm:text-base sm:text-lg">
          Subtotal
        </p>
        <p className="text-sm 2xsm:text-lg text-primaryDark font-semibold">
          $100.00
        </p>
      </div>

      <div className="w-full flex items-center justify-between py-2">
        <p className="text-primary text-sm 2xsm:text-base sm:text-lg ">
          Estimated Tax
        </p>
        <p className="text-sm 2xsm:text-lg text-primaryDark font-semibold">
          $5.00
        </p>
      </div>

      <hr className="my-4 border-primary" />

      <div className="w-full flex items-center justify-between py-2">
        <p
          className="text-sm 2xsm:text-base sm:text-lg font-semibold
          text-primaryDark"
        >
          Total
        </p>
        <p className="text-sm 2xsm:text-lg font-bold text-primaryDark">
          $1280.00
        </p>
      </div>

      <Button className="checkout-btn">Proceed to Checkout</Button>
    </div>
  );
};

export default CartSummary;
