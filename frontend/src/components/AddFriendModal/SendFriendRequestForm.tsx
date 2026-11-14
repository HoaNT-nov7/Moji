import type { UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";

interface SendRequestProps {
  register: UseFormRegister<IFormValues>;
  loading: boolean;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const SendFriendRequestForm = ({
  register,
  loading,
  searchedUsername,
  onSubmit,
  onBack,
}: SendRequestProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <span className="success-message">
          Tìm thấy <span className="font-semibold">@{searchedUsername}</span>{" "}
          rồi nè
        </span>

        <Label id="message" className="text-sm font-semibold">
          Giới thiệu
        </Label>

        <Textarea
          id="message"
          placeholder="Chào bạn ~ Có thể kết bạn được không? ..."
          rows={3}
          className="glass rounded-xl px-3 border-border/50 focus-visible:border-primary/50 transition-smooth resize-none"
          {...register("message")}
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          className="flex-1 glass hover:text-destructive"
          onClick={onBack}
        >
          Quay lại
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
        >
          {loading ? (
            <span>Đang gửi...</span>
          ) : (
            <>
              <UserPlus className="size-4 mr-2" /> Kết bạn
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SendFriendRequestForm;
