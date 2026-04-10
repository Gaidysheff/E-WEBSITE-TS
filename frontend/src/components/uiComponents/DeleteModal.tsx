import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";
import { X } from "lucide-react";

interface Props {
  handleDeleteReview?: VoidFunction;
  deleteCartItemHandler?: VoidFunction;
  deleteCartitem?: boolean;
}
const DeleteModal = ({
  handleDeleteReview,
  deleteCartItemHandler,
  deleteCartitem,
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {deleteCartitem ? (
          <button
            type="button"
            className="p-1 2xsm:p-2 rounded-md bg-red-500/20 hover:bg-red-100 
                transition text-red-500 border border-red-300 cursor-pointer"
          >
            <X className="w-[15px] h-[15px] 2xsm:w-5 2xsm:h-5" />
          </button>
        ) : (
          <button
            type="button"
            className="bg-primaryLight p-2 rounded-md cursor-pointer
              transition-all hover:bg-gray-300"
          >
            <Trash2 className="size-5 text-primaryDark" />
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          {deleteCartitem ? (
            <AlertDialogDescription>
              You are about to delete this Cart Item.
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              review you have on this product and remove your review from our
              servers.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={
              deleteCartitem ? deleteCartItemHandler : handleDeleteReview
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
