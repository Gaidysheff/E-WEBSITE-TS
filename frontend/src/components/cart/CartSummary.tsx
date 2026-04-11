import { BASE_URL } from "@/api/api.ts";
import Button from "@/components/uiComponents/Button";
import { ListChecks } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { useCart } from "@/store/CartContext.tsx";
import { useNavigate } from "@tanstack/react-router";

// ----------------- Version for STRIPE -----------------------
// import { initiatePaymentAction } from "@/api/actions.ts";
// import { useUser } from "@/store/UserContext.tsx";
// import { type UserLoggedIn } from "@/lib/types.ts";
// import StripeIcon from "@/components/svgImages/StripeIcon.tsx";
// import CloudPayments from "@/components/svgImages/CloudPaymentsForButton";
// import { useState } from "react";

interface Props {
  total: number;
}

const CartSummary = ({ total }: Props) => {
  const navigate = useNavigate();

  const { items, cartItemsCount } = useCart();

  // ----------------- Version for STRIPE -----------------------
  // const [initiatePaymentLoader, setInitiatePaymentLoader] =
  //   useState<boolean>(false);

  // const tax = 5;
  // const cartSubTotal = total;
  // const cartTotal = cartSubTotal + tax;

  // const isAuthorized = !!localStorage.getItem("Token");

  // const { user } = useUser();
  // const email = typeof user === "undefined" ? "" : user.email;

  // const { cartCode } = useCart();

  // const paymentObject = { email, cart_code: cartCode };

  // const initiatePaymentHandler = () => {
  //   setInitiatePaymentLoader(true);
  //   initiatePaymentAction(paymentObject);
  //   setInitiatePaymentLoader(false);
  //   // ------ Delay for loading --------
  //   // const reloadDelay = () => {
  //   //   setInitiatePaymentLoader(false);
  //   // };
  //   // setTimeout(reloadDelay, 7000);
  // };

  // const proceedCloudPaymentHandler = () => {
  //   navigate({ to: "/payment" });
  // };

  return (
    <div
      className="xl:w-[400px] max-lg:w-full border border-primaryDark
      rounded-lg shadow-xl bg-card px-8 py-6"
    >
      <h2 className="font-semibold text-2xl text-primaryDark mb-6">
        Order Summary
      </h2>

      {/* Images of selected Products  */}
      <div className="flex gap-2">
        {items.map((item) => (
          <div key={item.id} className="relative w-10 h-10">
            <img
              src={`${BASE_URL}${item.product.image}`}
              alt="item-img"
              className="rounded-lg object-cover w-full h-full"
            />
            {/* Индикатор количества поверх картинки */}
            {item.quantity > 1 && (
              <span
                className="absolute -top-2 -right-2 bg-primaryDark
                text-[10px] w-5 h-5 flex items-center justify-center
                rounded-full border-2 border-white text-white dark:text-black"
              >
                {item.quantity}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-between py-2">
        <p className="text-primary text-sm 2xsm:text-base sm:text-lg">
          Number of selected goods
        </p>
        <p className="text-sm 2xsm:text-lg text-primaryDark font-semibold">
          {/* $100.00 */}
          <NumericFormat
            value={cartItemsCount}
            displayType={"text"}
            decimalScale={0}
            fixedDecimalScale
            thousandSeparator=" "
            decimalSeparator="."
            // prefix={"$ "}
            // suffix={" ₽"}
          />
        </p>
      </div>

      {/* <div className="w-full flex items-center justify-between py-2">
        <p className="text-primary text-sm 2xsm:text-base sm:text-lg ">
          Estimated Tax
        </p>
        <p className="text-sm 2xsm:text-lg text-primaryDark font-semibold">
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
      </div> */}

      <hr className="my-4 border-primary" />

      <div className="w-full flex items-center justify-between py-2">
        <p
          className="text-sm 2xsm:text-base sm:text-lg font-semibold
          text-primaryDark"
        >
          Total
        </p>
        <p className="text-sm 2xsm:text-lg font-bold text-primaryDark">
          <NumericFormat
            value={total}
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

      {/* <Button
        disabled={!isAuthorized || cartSubTotal < 0.01 || initiatePaymentLoader}
        handleClick={initiatePaymentHandler}
        className="checkout-btn"
      >
        {isAuthorized ? (
          initiatePaymentLoader ? (
            // ? "Redirecting to Stripe"
            <div>
              <div className="inline-flex items-center">
                <span>Redirecting to</span>
                <span className="h-[20px] ml-2">
                  <StripeIcon />
                </span>
              </div>
            </div>
          ) : (
            // "Proceed to Checkout"
            <div className="inline-flex items-center">
              <span>Proceed with</span>
              <span className="h-[20px] ml-2">
                <StripeIcon />
              </span>
            </div>
          )
        ) : (
          "Login to Proceed with Checkout"
        )}
      </Button>
      <Button
        disabled={cartSubTotal < 0.01 || initiatePaymentLoader}
        handleClick={proceedCloudPaymentHandler}
        className="checkout-btn"
      >
        {initiatePaymentLoader ? (
          <div>
            <div className="inline-flex items-center">
              <span>Redirecting to ...</span>
              <span className="h-[20px] ml-2">
                <CloudPayments />
              </span>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center">
            <span>Proceed with</span>
            <span className="h-[20px] ml-2">
              <CloudPayments />
            </span>
          </div>
        )}
      </Button> */}
      <Button
        disabled={total < 0.01}
        handleClick={() => {
          navigate({ to: "/checkout" });
        }}
        className="checkout-btn"
      >
        <div className="inline-flex items-center">
          <span className="mr-2">Proceed with Checklist</span>
          <span>
            <ListChecks className="size-[24px]" />
          </span>
        </div>
      </Button>
    </div>
  );
};

export default CartSummary;
