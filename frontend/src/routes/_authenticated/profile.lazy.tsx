import Orders from "@/components/order/Orders";
import Wishlist from "@/components/wishlist/Wishlist";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Orders />
      <Wishlist />
    </>
  );
}
