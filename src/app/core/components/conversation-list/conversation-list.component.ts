import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '@ui';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { SkeletonModule } from 'primeng/skeleton';
import { BehaviorSubject, catchError, switchMap } from 'rxjs';
import { Conversation, ConversationDTO } from '../../models/conversation';
import { AuthService } from '../../services/auth.service';
import { RestService } from '../../services/rest.service';
import { ConversationComponent } from './conversation/conversation.component';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [FormsModule, SkeletonModule, AutoCompleteModule, AvatarComponent, ConversationComponent, AsyncPipe, NgClass],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss',
  host: { class: 'p-panel' },
})
export class ConversationListComponent {
  private restService = inject(RestService);
  private authService = inject(AuthService);

  protected readonly DELAY = 500;

  searchInput = new BehaviorSubject<string>('');
  private userSuggestions$ = this.searchInput.pipe(
    switchMap((search) => (search ? this.restService.getUsersByQuery(search) : [])),
    catchError(() => [])
  );

  conversations = signal<Conversation[]>([]);
  newConversation = signal<ConversationDTO>(null!);
  userSuggestions = toSignal(this.userSuggestions$, { initialValue: [] });
  selectedConversation = signal<Conversation | null>(null);
  loading = signal<boolean>(false);
  addingConversation = signal<boolean>(false);

  constructor() {
    this.loading.set(true);
    this.restService.getAllConversations().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  createNewConversation(event: AutoCompleteSelectEvent) {
    this.searchInput.next('');
    const existingConversation = this.conversations().find((conversation) => conversation.users[1]._id === event.value._id);
    if (existingConversation) {
      this.selectedConversation.set(existingConversation);
    } else {
      this.addingConversation.set(true);
      this.newConversation.set(new ConversationDTO(this.authService.session()!._id, event.value._id));
      this.restService.createConversation(this.newConversation()).subscribe({
        next: (conversation) => {
          this.conversations.set([conversation, ...this.conversations()]);
          this.selectedConversation.set(conversation);
          this.addingConversation.set(false);
        },
        error: () => this.addingConversation.set(false),
      });
    }
  }

  selectConversation(conversation: Conversation | null) {
    this.selectedConversation.set(conversation ? structuredClone(conversation) : null);
  }
}
