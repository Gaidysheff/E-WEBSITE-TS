import CartItem from "@/components/cart/CartItem.tsx";
import CartSummary from "@/components/cart/CartSummary.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cart/$cartcode")({
  component: CartItemPage,
});

function CartItemPage() {
  // const cartitems_count = 3;
  return (
    <section className="py-9">
      <h1 className="font-semibold text-2xl text-primaryDark mb-6">Cart</h1>
      <div className="flex flex-wrap gap-6 lg:gap-8 justify-between w-full">
        {/* Cartitem */}
        <div
          className="w-[600px] max-lg:w-full border border-primaryDark 
          shadow-xl rounded-lg bg-white overflow-hidden flex-1"
        >
          <div
            className="max-h-[650px] overflow-y-auto p-2 xsm:p-3 
            sm:px-6 sm:py-4 bg-card"
          >
            <CartItem />
            <CartItem />
            <CartItem />
          </div>
        </div>

        {/* CartSummary */}
        <CartSummary />
      </div>
    </section>
  );
}
