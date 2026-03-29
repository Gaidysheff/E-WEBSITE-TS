import { BASE_URL } from "@/api/api.ts";
import { Spinner } from "@/components/ui/spinner";
import { MapPinHouse } from "lucide-react";

import { type UserLoggedIn } from "@/lib/types.ts";
interface Props {
  user: UserLoggedIn | undefined;
  isLoading: boolean;
}

const ShippingInfo = ({ user, isLoading }: Props) => {
  const email = typeof user === "undefined" ? "" : user.email;
  const address = user?.address;
  const imgURL = `${BASE_URL}${user?.image}`;

  return (
    <div
      className="sm:grid sm:grid-cols-3 gap-4 mt-5
      items-center justify-center"
    >
      <div className="">
        {user?.image && (
          <img src={imgURL} className="w-50 mx-auto" alt="User's image" />
        )}
      </div>
      <div className="col-span-2 flex flex-col">
        <div className="text-2xl font-semibold my-3">Your Shipping Info</div>
        {isLoading ? (
          <Spinner className="size-20 text-red-500 mx-auto" />
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-2 my-2">
              <div className="">Email</div>
              <div className="col-span-2">{email}</div>
            </div>
            {!address?.street ? (
              <div className="w-full p-6 text-center bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-full shadow">
                    <MapPinHouse className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-700">
                    No Shipping Address Yet
                  </div>
                  <p className="text-gray-500 max-w-md">
                    You haven't placed your shipping address yet. When you do,
                    it'll appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">Street</div>
                  <div className="col-span-2">{address?.street}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">City</div>
                  <div className="col-span-2">{address?.city}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">State</div>
                  <div className="col-span-2">{address?.state}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">Phone</div>
                  <div className="col-span-2">{address?.phone}</div>
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
