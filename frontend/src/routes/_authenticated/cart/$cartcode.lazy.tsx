import { createLazyFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BASE_URL } from "@/api/api";
import CartItem from "@/components/cart/CartItem";
import CartItemSkeleton from "@/components/cart/CartItemSkeleton.tsx";
import CartSummary from "@/components/cart/CartSummary";
import CartSummarySkeleton from "@/components/cart/CartSummarySkeleton.tsx";
import { useCart } from "@/store/CartContext.tsx";
import usePageSEO from "@/hooks/usePageSEO.ts";

export const Route = createLazyFileRoute("/_authenticated/cart/$cartcode")({
  component: CartItemPage,
});

function CartItemPage() {
  const { cartcode } = Route.useParams();

  const { items, totalPrice, refreshCart, isLoading } = useCart();

  const cartitems_count = items?.length ?? 0;

  const routerState = useRouterState();
  const currentPathname = routerState.location.pathname;

  // При загрузке страницы проверяем, актуальны ли данные
  useEffect(() => {
    refreshCart();
  }, [cartcode]); // если код корзины в URL сменится, обновим данные

  usePageSEO({
    title: "Eshop | Cart",
    description:
      "Here you can find all your items you have selected and put in your shopping cart.",
  });

  return (
    <>
      <>
        <link
          rel="icon"
          type="image/png"
          href="/gift-96x96.png"
          sizes="96x96"
        />

        <link
          rel="icon"
          type="image/svg+xml"
          href="/shopping-basket.svg"
          sizes="any3"
        />

        <link rel="canonical" href={`${BASE_URL}${currentPathname}`} />
      </>
      <section className="py-9">
        <h1 className="font-semibold text-2xl text-primaryDark mb-6">Cart</h1>
        <div className="flex flex-wrap gap-6 lg:gap-8 justify-between w-full">
          {/* Cartitem */}
          <div
            className="w-[600px] max-lg:w-full border border-primaryDark 
            shadow-xl rounded-lg bg-white dark:bg-black overflow-hidden flex-1"
          >
            <div
              className="max-h-[650px] overflow-y-auto p-2 xsm:p-3 
              sm:px-6 sm:py-4 bg-card"
            >
              {isLoading ? (
                <CartItemSkeleton cards={2} />
              ) : cartitems_count ? (
                items.map((item) => <CartItem key={item.id} cartItem={item} />)
              ) : (
                <p className="text-center text-gray-500 py-10">
                  Your cart is empty.
                </p>
              )}
            </div>
          </div>

          {/* CartSummary */}
          {isLoading ? (
            <CartSummarySkeleton />
          ) : (
            <CartSummary total={totalPrice} />
          )}
        </div>
      </section>
    </>
  );
}
