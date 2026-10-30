import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";

const ChatAppPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <ChatWindowLayout />
    </SidebarProvider>
  );
};

export default ChatAppPage;
