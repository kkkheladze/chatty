import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private restService = inject(RestService);
  private mainService = inject(MainService);
  private authService = inject(AuthService);

  chat = this.mainService.selectedChat;
  chat$ = toObservable(this.chat);

  initialMessages$ = this.chat$.pipe(
    filter((chat) => {
      if (!chat) return false;
      if (this.mainService.isChatCached(chat._id)) {
        this.messages.set(this.mainService.getMessagesFromCache(chat._id)!);
        return false;
      }
      return true;
    }),
    switchMap((chat) => this.restService.getMessages(chat!._id).pipe(tap((messages) => this.mainService.cacheMessages(chat!._id, messages)))),
    catchError(() => [])
  );

  ownUserId = computed(() => this.authService.user()?._id);

  messages = signal<Message[]>([]);
  form = new FormGroup({
    message: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    // TODO: Add attachments?
  });
  sendingMessage = signal<boolean>(false);

  constructor() {
    this.initialMessages$.subscribe({
      next: (messages) => {
        this.messages.set(messages);
      },
    });
  }

  sendMessage() {
    if (this.form.invalid || !this.chat()) return;
    this.sendingMessage.set(true);
    this.restService.sendMessage(this.chat()!._id, { senderId: this.authService.user()!._id, text: this.form.getRawValue().message }).subscribe({
      next: (message) => {
        this.form.reset();
        this.sendingMessage.set(false);
        this.messages.update((messages) => (messages.unshift(message), messages));
        this.mainService.setLastMessage(this.chat()!._id, message);
      },
      error: () => this.sendingMessage.set(false),
    });
  }
}
