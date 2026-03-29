import { HeartOff } from "lucide-react";
import MiniProductCard from "@/components/order/MiniProductCard";
import { Spinner } from "@/components/ui/spinner";
import getWishListsOptions from "@/api/queryOptions/getWishListsOptions.ts";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/store/UserContext.tsx";

const Wishlist = () => {
  const { user } = useUser();
  const email = typeof user === "undefined" ? "" : user.email;

  const {
    data: wishlists,
    error,
    isPending,
  } = useQuery(getWishListsOptions(email));

  if (error) {
    toast.error("An unknown error occured", { autoClose: 3000 });
  }

  return (
    <section className="my-10">
      <h2
        className="text-center font-bold text-primaryDark mt-2 mb-4 
        text-base xsm:text-lg sm:text-2xl"
      >
        Products added to Wishlist
      </h2>

      {/* Content */}
      <div
        className="flex items-center w-[full] gap-4 px-6 py-6 bg-card
        custom-overflow rounded-lg shadow-sm"
      >
        {isPending && <Spinner className="size-30 text-red-500 mx-auto" />}

        {!wishlists || wishlists.length == 0 ? (
          <div className="w-full p-6 text-center bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-full shadow">
                <HeartOff className="w-10 h-10 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-700">
                Your Wishlist is empty
              </div>
              <p className="text-gray-500 max-w-md text-wrap">
                It looks like you haven't placed any item in your Wishlist yet.
                Start exploring ans save your favourites! When you do, it'll
                appear here.
              </p>
            </div>
          </div>
        ) : (
          wishlists.map((wishlist) => (
            <MiniProductCard key={wishlist.id} item={wishlist} />
          ))
        )}
      </div>
    </section>
  );
};

export default Wishlist;
