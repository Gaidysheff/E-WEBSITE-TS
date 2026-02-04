import IndividualOrder from "./IndividualOrder";
import getOrdersOptions from "@/api/queryOptions/getOrdersOptions.ts";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/store/UserContext.tsx";
import { type UserLoggedIn } from "@/lib/types.ts";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";
import { PackageSearch } from "lucide-react";

const OrderContainer = () => {
  const user: UserLoggedIn | undefined = useUser();
  const email = typeof user === "undefined" ? "" : user.email;

  const { data, error, isPending } = useQuery(getOrdersOptions(email));

  if (error) {
    toast.error("An unknown error occured");
  }

  if (!data || data.length == 0) {
    return (
      <div className="w-full py-20 px-6 text-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-full shadow">
            <PackageSearch className="w-10 h-10 text-gray-400" />
          </div>
          <div className="text-2xl font-semibold text-gray-700">
            No Orders Yet
          </div>
          <p className="text-gray-500 max-w-md">
            It looks like you haven't placed any orders yet. When you do,
            they'll appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-[320px] sm:h-[410px] overflow-y-auto space-y-6
      rounded-md bg-card"
    >
      {isPending && <Spinner className="size-30 text-red-500 mx-auto" />}
      {data &&
        data.map((order) => <IndividualOrder key={order.id} order={order} />)}
    </div>
  );
};

export default OrderContainer;
