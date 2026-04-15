import { createLazyFileRoute, useRouterState } from "@tanstack/react-router";

import AddressFormTanstack from "@/components/order/AddressFormTanstack.tsx";
import { BASE_URL } from "@/api/api";
import Modal from "@/components/uiComponents/Modal.tsx";
import Orders from "@/components/order/Orders";
import ShippingInfo from "@/components/profile/ShippingInfo.tsx";
import Wishlist from "@/components/wishlist/Wishlist";
import usePageSEO from "@/hooks/usePageSEO.ts";
import { useState } from "react";
import { useUser } from "@/store/UserContext.tsx";

// import { Spinner } from "@/components/ui/spinner";

export const Route = createLazyFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    <>
      <link rel="canonical" href={`${BASE_URL}${currentPathname}`} />

      <ShippingInfo user={user} isLoading={isLoading} />

      <Modal
        addressForm
        address={address}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      >
        <AddressFormTanstack
          address={address}
          // isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>

      {/* {isPending && <Spinner className="size-30 text-red-500 mx-auto" />} */}

      <Orders />
      <Wishlist />
    </>
  );
}
