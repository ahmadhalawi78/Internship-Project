export class ChatEventManager {
    private static instance: ChatEventManager;
    private listeners: Map<string, Set<(data: unknown) => void>> = new Map();
  
    private constructor() {}
  
    static getInstance(): ChatEventManager {
      if (!ChatEventManager.instance) {
        ChatEventManager.instance = new ChatEventManager();
      }
      return ChatEventManager.instance;
    }
  
    on(event: string, callback: (data: unknown) => void) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event)!.add(callback);
  
      return () => {
        this.listeners.get(event)?.delete(callback);
      };
    }
  
    emit(event: string, data: unknown) {
      this.listeners.get(event)?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }
  
  export const ChatEvents = {
    MESSAGE_SENT: 'message:sent',
    MESSAGE_RECEIVED: 'message:received',
    CHAT_ERROR: 'chat:error',
    TYPING_START: 'typing:start',
    TYPING_END: 'typing:end',
  } as const;