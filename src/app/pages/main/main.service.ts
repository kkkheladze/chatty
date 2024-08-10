import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Chat } from '@core/models/chat';
import { Message } from '@core/models/message';

@Injectable()
export class MainService {
  private router = inject(Router);

  private messageCache = new Map<string, Message[]>();
  chats = signal<Chat[]>([]);
  selectedChat = signal<Chat | null>(null);
  sidebarOpen = signal<boolean>(false);

  getMessagesFromCache(chatId: string) {
    return this.messageCache.get(chatId);
  }

  cacheMessages(chatId: string, messages: Message[]) {
    this.messageCache.set(chatId, messages);
  }

  isChatCached(chatId: string) {
    return this.messageCache.has(chatId);
  }

  selectChat(chatId: string) {
    if (this.selectedChat() && chatId === this.selectedChat()!._id) return;
    const chat = this.chats().find((chat) => chat._id === chatId);
    if (chat) this.selectedChat.set(chat);
    else this.router.navigate(['']);
  }

  setLastMessage(chatId: string, message: Message) {
    if (!chatId) return;
    this.chats.update((chats) => {
      const index = chats.findIndex((chat) => chat._id === chatId);
      if (index >= 0) {
        const [selectedChat] = chats.splice(index, 1);
        selectedChat.lastMessage = message;
        selectedChat.updatedAt = message.sentAt;

        const updatedChat = { ...selectedChat };
        if (this.selectedChat()?._id === selectedChat._id) this.selectedChat.set(updatedChat);
        return [updatedChat, ...chats];
      }
      return chats;
    });
  }
}
