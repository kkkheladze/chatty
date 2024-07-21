import { Message } from './message';
import { User } from './user';

export class ChatDTO {
  users: string[];

  constructor(user1Id: string, user2Id: string) {
    this.users = [user1Id, user2Id];
  }
}

export type Chat = { _id: string; users: User[]; lastMessage: Message | null; updatedAt: string };
