import { createLazyFileRoute, useRouterState } from "@tanstack/react-router";

import AddressFormTanstack from "@/components/order/AddressFormTanstack.tsx";
import { BASE_URL } from "@/api/api";
import Modal from "@/components/uiComponents/Modal.tsx";
import Orders from "@/components/order/Orders";
import ShippingInfo from "@/components/profile/ShippingInfo.tsx";
import UserInfo from "@/components/profile/UserInfo.tsx";
import UserInfoForm from "@/components/profile/UserInfoForm.tsx";
import Wishlist from "@/components/wishlist/Wishlist";
import usePageSEO from "@/hooks/usePageSEO.ts";
import { useState } from "react";
import { useUser } from "@/store/UserContext.tsx";

// import { Spinner } from "@/components/ui/spinner";

export const Route = createLazyFileRoute(
  "/$lang/_mainLayout/_authenticated/profile",
)({
  component: ProfilePage,
});

function ProfilePage() {
  // Может принимать значения: null, "user_info", "address", "review"
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const { user, isLoading } = useUser();

  const address = user?.address;

  // const email = typeof user === "undefined" ? "" : user.email;
  // const { data: address, isPending } = useQuery(getAddressOptions(email));

  const routerState = useRouterState();
  const currentPathname = routerState.location.pathname;

  usePageSEO({
    title: "Eshop | User's Profile",
    description: "This is user's Profile page",
  });

  return (
    <div className="container">
      <link rel="canonical" href={`${BASE_URL}${currentPathname}`} />

      <UserInfo
        user={user}
        isLoading={isLoading}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />

      <Modal
        userInfo
        user={user}
        isModalOpen={activeModal === "user_info"}
        // Откроется, только если стейт равен "user_info"
        setIsModalOpen={(open) => setActiveModal(open ? "user_info" : null)}
      >
        <UserInfoForm setIsModalOpen={() => setActiveModal(null)} />
      </Modal>

      <ShippingInfo user={user} isLoading={isLoading} />

      <Modal
        addressForm
        address={address}
        isModalOpen={activeModal === "address"}
        // Откроется, только если стейт равен "address"
        setIsModalOpen={(open) => setActiveModal(open ? "address" : null)}
      >
        <AddressFormTanstack
          address={address}
          setIsModalOpen={() => setActiveModal(null)}
        />
      </Modal>

      {/* {isPending && <Spinner className="size-30 text-myMainColor mx-auto" />} */}

      <Orders />
      <Wishlist />
    </div>
  );
}
