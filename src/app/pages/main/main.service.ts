import { inject, Injectable, signal } from '@angular/core';
import { Message } from '../../core/models/message';
import { Conversation } from '../../core/models/conversation';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private router = inject(Router);

  private messageCache = new Map<string, Message[]>();
  conversations = signal<Conversation[]>([]);
  selectedConversation = signal<Conversation | null>(null);

  getConversationMessages(conversationId: string) {
    return this.messageCache.get(conversationId);
  }

  cacheConversationMessages(conversationId: string, messages: Message[]) {
    this.messageCache.set(conversationId, messages);
  }

  isConversationCached(conversationId: string) {
    return this.messageCache.has(conversationId);
  }

  selectConversationById(conversationId: string) {
    if (this.selectedConversation() && conversationId === this.selectedConversation()!._id) return;
    const conversation = this.conversations().find((conversation) => conversation._id === conversationId);
    if (conversation) this.selectedConversation.set(conversation);
    else this.router.navigate(['']);
  }

  setLastMessage(conversationId: string, message: Message) {
    if (!conversationId) return;
    this.conversations.update((conversations) => {
      const index = conversations.findIndex((conversation) => conversation._id === conversationId);
      if (index !== -1) {
        const [selectedConversation] = conversations.splice(index, 1);
        selectedConversation.lastMessage = message;
        selectedConversation.updatedAt = message.createdAt;
        conversations.unshift(selectedConversation);
        return structuredClone(conversations);
      }
      return conversations;
    });
  }
}
