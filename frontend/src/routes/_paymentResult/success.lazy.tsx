import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_paymentResult/success")({
  component: Success,
});

export function Success() {
  return (
    <section
      className="bg-gradient-to-br from-green-50 to-green-100 px-6 py-20
      text-center h-screen flex items-center"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <h1
          className="text-4xl md:text-5xl font-semibold text-green-900
          leading-snug"
        >
          🎉 Thank You for Your Purchase!
        </h1>
        <p className="text-lg md:text-xl text-green-800 max-w-2xl mx-auto">
          Your order was placed successfully! We truly appreciate your business
          and will send you updates once your order ships.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/profile"
            className="inline-block px-6 py-3 rounded-full bg-green-700
            text-white text-base font-medium hover:bg-green-800
            transition duration-300"
          >
            View Order
          </Link>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-full bg-black
            text-white text-base font-medium hover:bg-green-800
            transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
