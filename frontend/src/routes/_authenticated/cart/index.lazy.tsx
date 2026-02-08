import { Link, createLazyFileRoute } from "@tanstack/react-router";

import { BASE_URL } from "@/api/api";

export const Route = createLazyFileRoute("/_authenticated/cart/")({
  component: CartPage,
});

function CartPage() {
  return (
    <>
      <>
        {/* <link rel="icon" type="image/svg+xml" href="/shopping-basket.ico" /> */}
        <link rel="icon" type="image/svg" href="/shopping-basket.svg" />
        <title>E-Shop | Cart</title>
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
      <section className="w-full px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1
            className="text-4xl font-bold text-primaryDark leading-tight
                md:text-5xl"
          >
            You haven&apos;t added any item to your cart.
          </h1>

          <Link to="/" className="default-btn mx-auto">
            Go back home
          </Link>
        </div>
      </section>
    </>
  );
}
