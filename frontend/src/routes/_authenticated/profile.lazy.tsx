import AddressForm from "@/components/order/AddressForm.tsx";
import { BASE_URL } from "@/api/api";
import Modal from "@/components/uiComponents/Modal.tsx";
import Orders from "@/components/order/Orders";
import ShippingInfo from "@/components/profile/ShippingInfo.tsx";
import Wishlist from "@/components/wishlist/Wishlist";
import { createLazyFileRoute } from "@tanstack/react-router";
import getAddressOptions from "@/api/queryOptions/getAddressOptions.ts";
import usePageSEO from "@/hooks/usePageSEO.ts";
import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useUser } from "@/store/UserContext.tsx";

// import { Spinner } from "@/components/ui/spinner";

export const Route = createLazyFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useUser();
  const email = typeof user === "undefined" ? "" : user.email;

  const { data: address, isPending } = useQuery(getAddressOptions(email));

  const routerState = useRouterState();
  const currentPathname = routerState.location.pathname;

  usePageSEO({
    title: "Eshop | User's Profile",
    description: "This is user's Profile page",
  });

  return (
    <>
      <link rel="canonical" href={`${BASE_URL}${currentPathname}`} />

      <ShippingInfo address={address} isPending={isPending} />

      <Modal
        userAlreadyHaveReview={false}
        updateReviewModal={false}
        addressForm
        address={address}
      >
        <AddressForm address={address} />
      </Modal>

      {/* {isPending && <Spinner className="size-30 text-red-500 mx-auto" />} */}

      <Orders />
      <Wishlist />
    </>
  );
}
