import { BASE_URL } from "@/api/api.ts";
import Orders from "@/components/order/Orders";
import Wishlist from "@/components/wishlist/Wishlist";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useUser } from "@/store/UserContext.tsx";

export const Route = createLazyFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useUser();

  const imgURL = `${BASE_URL}${user?.image}`;

  return (
    <>
      {user?.image && (
        <img src={imgURL} className="w-50 mx-auto" alt="User's image" />
      )}
      <Orders />
      <Wishlist />
    </>
  );
}
