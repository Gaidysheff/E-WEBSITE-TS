import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18nContext } from "@/i18n/i18n-react";
import { type PureAddress, type UserLoggedIn } from "@/lib/types.ts";
import { cn } from "@/lib/utils.ts";
import { PenIcon } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

type Props = {
  children: React.ReactNode;
  userAlreadyHaveReview?: boolean;
  updateReviewModal?: boolean;
  addressForm?: boolean;
  userInfo?: boolean;
  user?: UserLoggedIn | undefined;
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
  userInfo,
  user,
  address,
  isModalOpen,
  setIsModalOpen,
  iframe,
}: Props) => {
  const { LL } = useI18nContext();

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
              // onClick={() => setIsModalOpen(true)} // Явно открываем
            >
              {address?.street
                ? LL.profile.updateAddress()
                : LL.profile.addAddress()}

              {/* {address?.street ? "Update Address" : "Add Address"} */}
            </button>
          ) : userInfo ? (
            <button
              type="button"
              className="default-btn max-sm:text-sm max-sm:px-4 my-6 mx-auto"
              // onClick={() => setIsModalOpen(true)} // Явно открываем
            >
              {user?.birthday &&
              user?.firstName &&
              user?.lastName &&
              user?.phone
                ? LL.profile.updateUserInfo()
                : LL.profile.addUserInfo()}

              {/* {user?.birthday &&
              user?.first_name &&
              user?.last_name &&
              user?.phone
                ? "Update User's Info"
                : "Add User's Info"} */}
            </button>
          ) : (
            <button
              type="button"
              className="default-btn max-sm:text-sm max-sm:px-4 my-6"
              // onClick={() => setIsModalOpen(true)} // Явно открываем
            >
              {LL.productSection.addReview()}
              {/* Click to add a review */}
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
                {LL.productSection.dialogTitle()}
                {/* Are you absolutely sure? */}
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
