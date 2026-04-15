import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils.ts";
import { PenIcon } from "lucide-react";
// import { type Dispatch, type SetStateAction } from "react";
import { type PureAddress } from "@/lib/types.ts";

import { type Dispatch, type SetStateAction } from "react";

type Props = {
  children: React.ReactNode;
  userAlreadyHaveReview?: boolean;
  updateReviewModal?: boolean;
  addressForm?: boolean;
  iframe?: boolean;
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
  iframe,
}: Props) => {
  if (userAlreadyHaveReview) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      {!iframe && (
        <DialogTrigger asChild>
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
              // onClick={() => setIsModalOpen(true)} // Явно открываем
            >
              Click to add a review
            </button>
          )}
        </DialogTrigger>
      )}

      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "",
          iframe ? "sm:max-w-[500px] p-0 overflow-hidden" : "p-2",
        )}
      >
        {iframe && (
          <div className="w-full h-[550px] flex flex-col">
            <iframe
              name="3ds-frame"
              title="3ds-frame"
              className="w-full flex-grow border-none"
            />
            {/* Форма тоже должна быть здесь, чтобы target="3ds-frame" сработал */}
            {children}
          </div>
        )}
        {/* {addressForm && <div>{children}</div>} */}
        {!iframe && (
          <>
            <DialogHeader>
              <DialogTitle className="hidden">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription asChild>{children}</DialogDescription>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
