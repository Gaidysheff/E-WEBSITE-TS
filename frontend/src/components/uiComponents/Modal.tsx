import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PenIcon } from "lucide-react";
// import { type Dispatch, type SetStateAction } from "react";
import { type PureAddress } from "@/lib/types.ts";

import { type Dispatch, type SetStateAction } from "react";

type Props = {
  children: React.ReactNode;
  userAlreadyHaveReview?: boolean;
  updateReviewModal?: boolean;
  addressForm?: boolean;
  address?: PureAddress | null | undefined;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const Modal = ({
  children,
  userAlreadyHaveReview,
  updateReviewModal,
  addressForm,
  address,
  isModalOpen,
  setIsModalOpen,
}: Props) => {
  if (userAlreadyHaveReview) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
            onClick={() => setIsModalOpen(true)} // Явно открываем
          >
            {address?.street ? "Update Address" : "Add Address"}
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
