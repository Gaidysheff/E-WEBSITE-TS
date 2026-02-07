import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PenIcon } from "lucide-react";

import { type Address } from "@/lib/types.ts";

type Props = {
  children: React.ReactNode;
  userAlreadyHaveReview: boolean;
  updateReviewModal: boolean;
  addressForm: boolean;
  address: Address | null | undefined;
};

const Modal = ({
  children,
  userAlreadyHaveReview,
  updateReviewModal,
  addressForm,
  address,
}: Props) => {
  if (userAlreadyHaveReview) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger
        asChild
        // className="default-btn max-sm:text-sm max-sm:px-4 my-6"
      >
        {/* Click to add a review */}
        {updateReviewModal ? (
          <button
            type="button"
            className="bg-primaryLight p-2 rounded-md cursor-pointer
            transition-all hover:bg-gray-300"
          >
            <PenIcon className="size-5 text-primaryDark" />
          </button>
        ) : addressForm ? (
          <button
            type="button"
            className="default-btn max-sm:text-sm max-sm:px-4 my-6 mx-auto"
          >
            {address?.city ? "Update Address" : "Add Address"}
          </button>
        ) : (
          <button
            type="button"
            className="default-btn max-sm:text-sm max-sm:px-4 my-6"
          >
            Click to add a review
          </button>
        )}
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="p-2">
        <DialogHeader>
          <DialogTitle className="hidden">Are you absolutely sure?</DialogTitle>
          <DialogDescription asChild>{children}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
