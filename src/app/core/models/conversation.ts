export class ConversationDTO {
  users: string[];

  constructor(user1Id: string, user2Id: string) {
    this.users = [user1Id, user2Id];
  }
}

export type Conversation = ConversationDTO & { _id: string };
