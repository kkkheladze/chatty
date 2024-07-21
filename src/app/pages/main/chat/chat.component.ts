import { AsyncPipe, NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from '@core/models/message';
import { AuthService } from '@core/services/auth.service';
import { RestService } from '@core/services/rest.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { catchError, filter, switchMap, tap } from 'rxjs';
import { MainService } from '../main.service';
import { MessageComponent } from './message/message.component';
import { ScreenService } from '@core/services/screen.service';
import { MobileViewDirective } from '@core/directives/mobile-view.directive';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, ProgressSpinnerModule, SkeletonModule, DividerModule, InputTextModule, ButtonModule, AsyncPipe, MessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  host: { class: 'p-panel' },
  hostDirectives: [MobileViewDirective],
})
export class ChatComponent {
  private restService = inject(RestService);
  private mainService = inject(MainService);
  private authService = inject(AuthService);
  mobileView = inject(ScreenService).mobileView;

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

  constructor() {
    this.initialMessages$.subscribe({
      next: (messages) => {
        this.messages.set(messages);
      },
    });
  }

  sendMessage() {
    if (this.form.invalid || !this.chat() || this.sending()) return;
    this.sending.set(true);
    this.restService.sendMessage(this.chat()!._id, { senderId: this.authService.user()!._id, text: this.form.getRawValue().message }).subscribe({
      next: (message) => {
        this.form.reset();
        this.sending.set(false);
        this.messages.update((messages) => (messages.unshift(message), messages));
        this.mainService.setLastMessage(this.chat()!._id, message);
      },
      error: () => this.sending.set(false),
    });
  }
}
