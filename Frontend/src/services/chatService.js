import { chatApi } from "@/api/rootApi";
import { SERVER_ERROR_MSG } from "@/constants/Messages";

class ChatService {
  constructor() {}

  extractReply(payload) {
    if (!payload) return "";

    if (typeof payload === "string") return payload.trim();

    return (
      payload.answer ||
      payload.response ||
      payload.message ||
      payload.data?.answer ||
      payload.data?.message ||
      ""
    )
      .toString()
      .trim();
  }

  async sendMessage({ message, files = [] }) {
    const payload = {
      message,
      attachments: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    };

    try {
      const response = await chatApi(payload);
      const reply = this.extractReply(response);

      return reply || SERVER_ERROR_MSG;
    } catch {
      return SERVER_ERROR_MSG;
    }
  }
}

const chatService = new ChatService();
export default chatService;
