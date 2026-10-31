import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

export const ChatService = {
  async fetchConversations(): Promise<ConversationResponse> {
    const res = await api.get("/conversations");
    return res.data;
  },
};
