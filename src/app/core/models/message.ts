import { User } from './user';

export type MessageDTO = {
  conversationId: string; // Conversation ID
  senderId: string; // User ID
  text: string;
};

export type Message = MessageDTO & {
  _id: string;
  createdAt: string;
};
