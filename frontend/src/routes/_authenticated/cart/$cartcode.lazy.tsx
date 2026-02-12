import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Error from "@/components/error/Error.tsx";
// import Error404notFound from "@/components/error/Error404notFound.tsx";
// import { toast } from "react-toastify";
// import { type CartItemsWithTotal, type Cartitem } from "@/lib/types.ts";
import { type Cartitem } from "@/lib/types.ts";
// import { type ErrorComponentProps } from "@tanstack/react-router";
import api from "@/api/api.ts";
import { CART_GET_URL } from "@/api/endpoints.ts";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useRouterState,
  createLazyFileRoute,
} from "@tanstack/react-router";
import { BASE_URL } from "@/api/api";
import usePageSEO from "@/hooks/usePageSEO.ts";

import CartItemSkeleton from "@/components/cart/CartItemSkeleton.tsx";
import CartSummarySkeleton from "@/components/cart/CartSummarySkeleton.tsx";

export const Route = createLazyFileRoute("/_authenticated/cart/$cartcode")({
  component: CartItemPage,

  // loader: async ({ params: { cartcode } }) => {
  //   const navigate = useNavigate();
  //   try {
  //     const getCart = await api.get<CartItems>(`${CART_GET_URL}${cartcode}`);

  //     return {
  //       _cartitems: getCart.data.cartitems,
  //       _cart_total: getCart.data.cart_total,
  //     };
  //   } catch (error: unknown) {
  //     console.log("🚀 ~ error:", error);
  //     if (error instanceof Error) {
  //       if (
  //         (error as any).message.includes("Cannot read properties of undefined")
  //         // error.message ==
  //         // "Cannot read properties of undefined (reading "data")"
  //       ) {
  //         // navigate({ to: `/cart` });
  //       }
  //       console.log("🚀 ~ FIND ERROR:", (error as any).message);
  //     }
  //     throw Error();
  //   }
  // },

  // pendingComponent: () => {},

  // errorComponent: (error: ErrorComponentProps) => {
  //   const navigate = useNavigate();
  //   console.log("🚀 ~ error:", error);

  //   if (
  //     (error as any).message.includes("Cannot read properties of undefined")
  //     // error.message ==
  //     // "Cannot read properties of undefined (reading "data")"
  //   ) {
  //     navigate({ to: `/cart` });
  //   }
  //   console.log("🚀 ~ FIND ERROR:", (error as any).message);

  //   // toast.error("Something went wrong");
  //   // return <Error404notFound />;
  //   // throw Error();
  // },
});

function CartItemPage() {
  const { cartcode } = Route.useParams();

  const routerState = useRouterState();
  const currentPathname = routerState.location.pathname;

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<Cartitem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const cartitems_count = cartItems.length;

  // ===================== Get Cart =========================

  const getCart = async (cart_code: string) => {
    setIsLoading(true);
    // --------------- Fetching delay ----------------------
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    // -----------------------------------------------------

    try {
      await api.get(`${CART_GET_URL}${cart_code}`).then((response) => {
        // console.log("🚀 ~ getCartAction ~ response:", response);

        if (typeof response === "undefined") {
          navigate({ to: `/cart` });
        } else {
          setCartItems(response.data.cartitems);
          setCartTotal(response.data.cart_total);
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("🚀 ~  ERROR:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCart(cartcode);
  }, []);

  // const { _cartitems, _cart_total } = Route.useLoaderData();
  // const cartitems: Cartitem[] = _cartitems;
  // const cart_total: number = _cart_total;

  usePageSEO({
    title: "Eshop | Cart",
    description:
      "Here you can find all your items you have selected and put in your shopping cart.",
  });

  return (
    <>
      <>
        {/* <link rel="icon" type="image/svg+xml" href="/shopping-basket.ico" /> */}

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

        {/* <link rel="canonical" href={`${BASE_URL}/cart/${cartcode}`} /> */}

        {/* <meta property="og:title" content="Eshop | OG:Title" />
        <meta property="og:description" content="This is OG:Description" />
        <meta property="og:image" content={"${Image}"} />
        <meta property="og:url" content={`${BASE_URL}/cart`} /> */}
      </>
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
              {isLoading ? (
                <CartItemSkeleton cards={2} />
              ) : cartitems_count > 0 ? (
                cartItems.map((cartItem) => (
                  <CartItem key={cartItem.id} cartItem={cartItem} />
                ))
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
            <CartSummary total={cartTotal} />
          )}
        </div>
      </section>
    </>
  );
}
