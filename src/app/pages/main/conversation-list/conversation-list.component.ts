import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '@ui';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { SkeletonModule } from 'primeng/skeleton';
import { BehaviorSubject, catchError, switchMap } from 'rxjs';
import { Conversation, ConversationDTO } from '../../../core/models/conversation';
import { AuthService } from '../../../core/services/auth.service';
import { RestService } from '../../../core/services/rest.service';
import { MainService } from '../main.service';
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
  private mainService = inject(MainService);

  searchInput = new BehaviorSubject<string>('');
  private userSuggestions$ = this.searchInput.pipe(
    switchMap((search) => (search ? this.restService.getUsersByQuery(search) : [])),
    catchError(() => [])
  );

  userSuggestions = toSignal(this.userSuggestions$, { initialValue: [] });
  conversations = this.mainService.conversations.asReadonly();
  selectedConversation = this.mainService.selectedConversation.asReadonly();
  loading = signal<boolean>(false);
  addingConversation = signal<boolean>(false);

  constructor() {
    this.loading.set(true);
    this.restService.getAllConversations().subscribe({
      next: (conversations) => {
        this.mainService.conversations.set(conversations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  createNewConversation(event: AutoCompleteSelectEvent) {
    this.searchInput.next('');
    const existingConversation = this.mainService.conversations().find((conversation) => conversation.users[1]._id === event.value._id);
    if (existingConversation) {
      this.selectConversation(existingConversation);
    } else {
      this.addingConversation.set(true);
      const newConversation = new ConversationDTO(this.authService.user()!._id, event.value._id);
      this.restService.createConversation(newConversation).subscribe({
        next: (conversation) => {
          this.mainService.conversations.update((conversations) => [conversation, ...conversations]);
          this.selectConversation(conversation);
          this.addingConversation.set(false);
        },
        error: () => this.addingConversation.set(false),
      });
    }
  }

  selectConversation(conversation: Conversation) {
    this.mainService.selectedConversation.set(conversation);
  }
}
