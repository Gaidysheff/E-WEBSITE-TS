import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/cart/")({
  component: CartPage,
});

function CartPage() {
  return (
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
  );
}
