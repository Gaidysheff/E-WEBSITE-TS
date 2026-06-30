import { Spinner } from "@/components/ui/spinner";
import { useI18nContext } from "@/i18n/i18n-react";
import { type UserLoggedIn } from "@/lib/types.ts";
import { cn } from "@/lib/utils";
import { MapPinHouse, Truck } from "lucide-react";

interface Props {
  user: UserLoggedIn | undefined;
  isLoading: boolean;
  forCheckoutPage?: boolean;
}

const ShippingInfo = ({ user, isLoading, forCheckoutPage }: Props) => {
  const { LL } = useI18nContext();

  // const email = typeof user === "undefined" ? "" : user.email;
  const address = user?.address;
  // const imgURL = `${BASE_URL}${user?.image}`;

  return (
    <div
      className="sm:grid sm:grid-cols-3 gap-4 mt-5
      items-center justify-center"
    >
      <div className={cn("", forCheckoutPage && "hidden")}>
        {/* {user?.image && (
          <img src={imgURL} className="w-50 mx-auto" alt="User's image" />
        )} */}
        <Truck size={160} className="w-50 mx-auto text-primary" />
      </div>

      <div className="col-span-2 flex flex-col">
        <div className="text-2xl font-semibold my-3">
          {LL.profile.shippingTitle()}
          {/* Your Shipping Info */}
        </div>
        {isLoading ? (
          <Spinner className="size-20 text-myMainColor mx-auto" />
        ) : (
          <div>
            {!address ? (
              <div className="w-full p-6 text-center bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-full shadow">
                    <MapPinHouse className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-700">
                    {LL.profile.shippingNoYet()}
                    {/* No Shipping Address Yet */}
                  </div>
                  <p className="text-gray-500 max-w-md">
                    {LL.profile.shippingEmptyText()}
                    {/* You haven't placed your shipping address yet. When you do,
                    it'll appear here. */}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.street()}
                    {/* Street */}
                  </div>
                  <div className="col-span-2">{address?.street}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.house()}
                    {/* house */}
                  </div>
                  <div className="col-span-2">{address?.house}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.apartment()}
                    {/* apartment */}
                  </div>
                  <div className="col-span-2">{address?.apartment}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.city()}
                    {/* City */}
                  </div>
                  <div className="col-span-2">{address?.city}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.zip()}
                    {/* zip */}
                  </div>
                  <div className="col-span-2">{address?.zip}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.region()}
                    {/* region */}
                  </div>
                  <div className="col-span-2">{address?.region}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.state()}
                    {/* State */}
                  </div>
                  <div className="col-span-2">{address?.state}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingInfo;
