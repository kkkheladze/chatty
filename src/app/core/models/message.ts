export type MessageDTO = {
  senderId: string; // User ID
  text: string;
};

export type Message = MessageDTO & {
  _id: string;
  sentAt: string;
  chatId: string;
  status: 'sent' | 'read';
};
