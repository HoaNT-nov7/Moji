import Logout from "@/components/auth/Logout";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);

  const handleClick = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("Ok");
    } catch (error) {
      console.error(error);
      toast.error("Thất bại");
    }
  };

  return (
    <div>
      {user?.username}
      <Logout />
      <Button onClick={handleClick}>Test</Button>
    </div>
  );
};

export default ChatAppPage;
