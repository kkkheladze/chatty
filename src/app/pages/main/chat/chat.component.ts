import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MobileViewDirective } from '@core/directives/mobile-view.directive';
import { Message } from '@core/models/message';
import { AuthService } from '@core/services/auth.service';
import { RestService } from '@core/services/rest.service';
import { WsService } from '@core/services/ws.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { catchError, filter, switchMap, tap } from 'rxjs';
import { MainService } from '../main.service';
import { MessageComponent } from './message/message.component';
import { AvatarComponent } from '@ui';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, ProgressSpinnerModule, SkeletonModule, DividerModule, InputTextModule, ButtonModule, AsyncPipe, MessageComponent, AvatarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-panel' },
  hostDirectives: [MobileViewDirective],
})
export class ChatComponent {
  private restService = inject(RestService);
  protected mainService = inject(MainService);
  private authService = inject(AuthService);
  private websocketService = inject(WsService);
  protected mobileView = inject(MobileViewDirective).mobileView;

  chat = this.mainService.selectedChat;
  chat$ = toObservable(this.chat);
  initialMessages$ = this.chat$.pipe(
    tap(() => this.loading.set(true)),
    filter((chat) => {
      if (!chat) return false;
      if (this.mainService.isChatCached(chat._id)) {
        this.messages.set(this.mainService.getMessagesFromCache(chat._id)!);
        this.loading.set(false);
        return false;
      }
      return true;
    }),
    switchMap((chat) => this.restService.getMessages(chat!._id).pipe(tap((messages) => this.mainService.cacheMessages(chat!._id, messages)))),
    tap(() => this.loading.set(false)),
    catchError(() => [])
  );
  messages = signal<Message[]>([]);
  ownUserId = computed(() => this.authService.user()?._id);

  form = new FormGroup({
    message: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    // TODO: Add attachments?
  });
  loading = signal<boolean>(false);
  sending = signal<boolean>(false);
  newMessage$ = this.websocketService.getSocket<Message>('new-message');

  constructor() {
    this.initialMessages$.subscribe({
      next: (messages) => {
        this.messages.set(messages);
      },
    });
    this.newMessage$.pipe(takeUntilDestroyed()).subscribe((message) => {
      if (message.senderId === this.ownUserId()) return;
      this.addNewMessage(message);
    });
  }

  sendMessage() {
    if (this.form.invalid || !this.chat() || this.sending()) return;
    this.sending.set(true);
    this.restService.sendMessage(this.chat()!._id, { senderId: this.authService.user()!._id, text: this.form.getRawValue().message }).subscribe({
      next: (message) => {
        this.form.reset();
        this.sending.set(false);
        this.addNewMessage(message);
      },
      error: () => this.sending.set(false),
    });
  }

  addNewMessage(message: Message) {
    this.messages.update((messages) => (messages.unshift(message), messages));
    this.mainService.setLastMessage(message.chatId, message);
  }
}
