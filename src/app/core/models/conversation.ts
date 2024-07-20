import { Message } from './message';
import { User } from './user';

export class ConversationDTO {
  users: string[];

  constructor(user1Id: string, user2Id: string) {
    this.users = [user1Id, user2Id];
  }
}

export type Conversation = { _id: string; users: User[]; lastMessage?: Message; updatedAt: string };
