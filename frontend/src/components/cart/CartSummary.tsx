import Button from "@/components/uiComponents/Button";
import { NumericFormat } from "react-number-format";

interface Props {
  total: number;
}

const CartSummary = ({ total }: Props) => {
  const isAuthorized = !!localStorage.getItem("Token");

  const tax = 5;
  const cartSubTotal = total;
  const cartTotal = cartSubTotal + tax;

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
          {/* $100.00 */}
          <NumericFormat
            value={cartSubTotal}
            displayType={"text"}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=" "
            decimalSeparator="."
            prefix={"$ "}
            // suffix={" ₽"}
          />
        </p>
      </div>

      <div className="w-full flex items-center justify-between py-2">
        <p className="text-primary text-sm 2xsm:text-base sm:text-lg ">
          Estimated Tax
        </p>
        <p className="text-sm 2xsm:text-lg text-primaryDark font-semibold">
          {/* $5.00 */}
          <NumericFormat
            value={tax}
            displayType={"text"}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=" "
            decimalSeparator="."
            prefix={"$ "}
            // suffix={" ₽"}
          />
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
          {/* $1280.00 */}
          <NumericFormat
            value={cartTotal}
            displayType={"text"}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=" "
            decimalSeparator="."
            prefix={"$ "}
            // suffix={" ₽"}
          />
        </p>
      </div>

      <Button
        disabled={!isAuthorized || cartSubTotal < 0.01}
        handleClick={() => {}}
        className="checkout-btn"
      >
        {isAuthorized
          ? "Proceed to Checkout"
          : "Login to Proceed with Checkout"}
      </Button>
    </div>
  );
};

export default CartSummary;
