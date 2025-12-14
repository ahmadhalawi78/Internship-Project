export interface ChatThread {
    id: string;
    thread_type: 'direct' | 'group' | 'listing';
    listing_id?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    last_message_at?: string;
  }
  
  export interface ChatParticipant {
    thread_id: string;
    user_id: string;
    joined_at: string;
    last_read_at?: string;
    is_muted: boolean;
  }
  
  export interface Message {
    id: string;
    thread_id: string;
    sender_id: string;
    content: string;
    status: 'sent' | 'delivered' | 'read';
    is_system: boolean;
    created_at: string;
    edited_at?: string;
    deleted_at?: string;
  }
  
  export interface UserProfile {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  }