import { ChatMessage, ChatResponse } from "@/types/chat";
import { ChatEventManager, ChatEvents } from "@/lib/events/chatEvents";

export class ChatService {
  private static eventManager = ChatEventManager.getInstance();

  static async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      this.eventManager.emit(ChatEvents.TYPING_START, {});

      this.eventManager.emit(ChatEvents.MESSAGE_SENT, {
        message: messages[messages.length - 1],
        timestamp: new Date(),
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const data: ChatResponse = await response.json();

      this.eventManager.emit(ChatEvents.MESSAGE_RECEIVED, {
        message: data.message,
        usage: data.usage,
        timestamp: new Date(),
      });

      this.eventManager.emit(ChatEvents.TYPING_END, {});

      return data.message;
    } catch (error) {
      this.eventManager.emit(ChatEvents.CHAT_ERROR, {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      });

      this.eventManager.emit(ChatEvents.TYPING_END, {});

      throw error;
    }
  }

  static subscribe(event: string, callback: (data: unknown) => void) {
    return this.eventManager.on(event, callback);
  }
}
