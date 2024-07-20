import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
import { Message } from '../../../core/models/message';
import { AuthService } from '../../../core/services/auth.service';
import { RestService } from '../../../core/services/rest.service';
import { MainService } from '../main.service';
import { MessageComponent } from './message/message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DividerModule, InputTextModule, ButtonModule, AsyncPipe, MessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  host: { class: 'p-panel' },
})
export class ChatComponent {
  private route = inject(ActivatedRoute);
  private restService = inject(RestService);
  private mainService = inject(MainService);
  private authService = inject(AuthService);

  conversation = this.mainService.selectedConversation;
  conversation$ = toObservable(this.conversation);

  initialMessages$ = this.conversation$.pipe(
    filter((conversation) => {
      if (!conversation) return false;
      if (this.mainService.isConversationCached(conversation._id)) {
        this.messages.set(this.mainService.getConversationMessages(conversation._id)!);
        return false;
      }
      return true;
    }),
    switchMap((conversation) => this.restService.getMessages(conversation!._id).pipe(tap((messages) => this.mainService.cacheConversationMessages(conversation!._id, messages)))),
    catchError(() => [])
  );

  ownUserId = computed(() => this.authService.user()?._id);

  messages = signal<Message[]>([]);
  messageInput = new FormControl<string>('', { nonNullable: true });
  sendingMessage = signal<boolean>(false);

  constructor() {
    this.initialMessages$.subscribe({
      next: (messages) => {
        this.messages.set(messages);
      },
    });
  }

  sendMessage() {
    if (!this.messageInput.value || !this.conversation()) return;
    this.sendingMessage.set(true);
    this.restService.sendMessage(this.conversation()!._id, { senderId: this.authService.user()!._id, text: this.messageInput.value }).subscribe({
      next: (message) => {
        this.messages.update((messages) => {
          messages.unshift(message);
          return messages;
        });
        this.messageInput.setValue('');
        this.sendingMessage.set(false);
        this.mainService.setLastMessage(this.conversation()!._id, message);
      },
      error: () => this.sendingMessage.set(false),
    });
  }
}
