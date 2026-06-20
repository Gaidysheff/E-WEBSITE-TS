import { BASE_URL } from "@/api/api.ts";
import { Spinner } from "@/components/ui/spinner";
import { MapPinHouse } from "lucide-react";
import { cn } from "@/lib/utils";
import { type UserLoggedIn } from "@/lib/types.ts";

import { useI18nContext } from "@/i18n/i18n-react";

interface Props {
  user: UserLoggedIn | undefined;
  isLoading: boolean;
  forCheckoutPage?: boolean;
}

const UserInfo = ({ user, isLoading, forCheckoutPage }: Props) => {
  const { LL } = useI18nContext();

  const email = typeof user === "undefined" ? "" : user.email;
  // const address = user?.address;
  const imgURL = `${BASE_URL}${user?.image}`;
  return (
    <div
      className="sm:grid sm:grid-cols-3 gap-4 mt-5
      items-center justify-center"
    >
      <div className={cn("", forCheckoutPage && "hidden")}>
        {user?.image && (
          <img src={imgURL} className="w-50 mx-auto" alt="User's image" />
        )}
      </div>

      <div className="col-span-2 flex flex-col">
        <div className="text-2xl font-semibold my-3">
          {/* {LL.profile.shippingTitle()} */}
          Your Personal Info
        </div>
        {isLoading ? (
          <Spinner className="size-20 text-myMainColor mx-auto" />
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-2 my-2">
              <div className="">
                {/* {LL.profile.email()} */}
                Email
              </div>
              <div className="col-span-2">{email}</div>
            </div>
            {!user?.birthday && !user?.first_name && !user?.last_name ? (
              <div className="w-full p-6 text-center bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-full shadow">
                    <MapPinHouse className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-700">
                    {/* {LL.profile.shippingNoYet()} */}
                    No Personal Info Yet.
                  </div>
                  <p className="text-gray-500 max-w-md">
                    {/* {LL.profile.shippingEmptyText()} */}
                    You haven't placed your personal information yet. When you
                    do, it'll appear here and you'll be able to edit it.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {/* {LL.profile.street()} */}
                    email
                  </div>
                  <div className="col-span-2">user?.email</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {/* {LL.profile.street()} */}
                    username
                  </div>
                  <div className="col-span-2">user?.username</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {/* {LL.profile.city()} */}
                    first name
                  </div>
                  <div className="col-span-2">user?.first_name</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {/* {LL.profile.state()} */}
                    last name
                  </div>
                  <div className="col-span-2">user?.last_name</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {/* {LL.profile.phone()} */}
                    phone
                  </div>
                  <div className="col-span-2">user?.NOT_EXISTS_YET</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
