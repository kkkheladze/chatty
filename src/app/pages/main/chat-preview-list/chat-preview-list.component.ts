import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Chat, ChatDTO } from '@core/models/chat';
import { AuthService } from '@core/services/auth.service';
import { RestService } from '@core/services/rest.service';
import { ThemeService } from '@core/services/theme.service';
import { AvatarComponent } from '@ui';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SkeletonModule } from 'primeng/skeleton';
import { BehaviorSubject, catchError, switchMap } from 'rxjs';
import { MainService } from '../main.service';
import { ChatComponent } from './chat-preview/chat-preview.component';

@Component({
  selector: 'app-chat-preview-list',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet, SkeletonModule, AutoCompleteModule, InputSwitchModule, AvatarComponent, ChatComponent, AsyncPipe, NgClass],
  templateUrl: './chat-preview-list.component.html',
  styleUrl: './chat-preview-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-panel' },
})
export class ChatPreviewListComponent {
  private restService = inject(RestService);
  private authService = inject(AuthService);
  private mainService = inject(MainService);
  protected themeService = inject(ThemeService);

  searchInput = new BehaviorSubject<string>('');
  private userSuggestions$ = this.searchInput.pipe(
    switchMap((search) => (search ? this.restService.getUsersByQuery(search) : [])),
    catchError(() => [])
  );

  userSuggestions = toSignal(this.userSuggestions$, { initialValue: [] });
  chats = this.mainService.chats.asReadonly();
  selectedChat = this.mainService.selectedChat.asReadonly();
  loading = signal<boolean>(false);
  addingChat = signal<boolean>(false);
  chatSelected = output<void>();

  constructor() {
    if (this.chats().length > 0) return;
    this.loading.set(true);
    this.restService.getChats().subscribe({
      next: (chats) => {
        this.mainService.chats.set(chats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  createChat(event: AutoCompleteSelectEvent) {
    this.searchInput.next('');
    const existingChat = this.mainService.chats().find((chat) => chat.users[1]._id === event.value._id);
    if (existingChat) {
      this.selectChat(existingChat);
    } else {
      this.addingChat.set(true);
      const newChat = new ChatDTO(this.authService.user()!._id, event.value._id);
      this.restService.createChat(newChat).subscribe({
        next: (chat) => {
          this.mainService.chats.update((chats) => [chat, ...chats]);
          this.selectChat(chat);
          this.addingChat.set(false);
        },
        error: () => this.addingChat.set(false),
      });
    }
  }

  selectChat(chat: Chat) {
    this.mainService.selectedChat.set(chat);
    this.chatSelected.emit();
  }
}
