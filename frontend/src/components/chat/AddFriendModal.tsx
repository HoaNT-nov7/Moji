import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserPlus } from "lucide-react";

interface IFormValues {
  username: string;
  message: string;
}

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);

  return (
    <Dialog>
      <DialogTrigger className="flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10">
        <UserPlus className="size-4" />
        <span className="sr-only">Kết bạn</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 border-none">
        <DialogHeader>
          <DialogTitle>Kết bạn</DialogTitle>
        </DialogHeader>

        {!isFound && <>{/* form seach by username */}</>}
        {isFound && <>{/* form send friend request */}</>}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;
