import { Link, createLazyFileRoute } from "@tanstack/react-router";

import { BASE_URL } from "@/api/api";
import { useI18nContext } from "@/i18n/i18n-react";

export const Route = createLazyFileRoute(
  "/$lang/_mainLayout/_authenticated/cart/",
)({
  component: CartPage,
});

function CartPage() {
  const { LL } = useI18nContext();

  return (
    <>
      <>
        {/* <link rel="icon" type="image/svg+xml" href="/shopping-basket.ico" /> */}
        <link rel="icon" type="image/svg" href="/shopping-basket.svg" />
        <title>
          E-Shop | {LL.cart.title()}
          {/* E-Shop | Cart */}
        </title>
        <meta
          name="description"
          content="Here you can find all your items you have selected and put in your shopping cart."
        />
        <link rel="canonical" href={`${BASE_URL}/cart/`} />

        {/* <meta property="og:title" content="Eshop | OG:Title" />
        <meta property="og:description" content="This is OG:Description" />
        <meta property="og:image" content={"${Image}"} />
        <meta property="og:url" content={`${BASE_URL}/cart`} /> */}
      </>
      <section className="container">
        <div className="w-full px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1
              className="text-4xl font-bold text-primaryDark leading-tight
                  md:text-5xl"
            >
              {LL.cart.emptyCart()}
              {/* You haven&apos;t added any item to your cart. */}
            </h1>

            <Link to="/" className="default-btn mx-auto">
              {LL.cart.goBack()}
              {/* Go back home */}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
