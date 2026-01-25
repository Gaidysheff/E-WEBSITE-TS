import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
  userAlreadyHaveReview: boolean;
};

const Modal = ({ children, userAlreadyHaveReview }: Props) => {
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

        <button
          type="button"
          className="default-btn max-sm:text-sm max-sm:px-4 my-6"
        >
          Click to add a review
        </button>
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
