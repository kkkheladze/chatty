import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '@ui';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { BehaviorSubject, catchError, switchMap } from 'rxjs';
import { Conversation, ConversationDTO } from '../../models/conversation';
import { AuthService } from '../../services/auth.service';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [FormsModule, AutoCompleteModule, AvatarComponent, AsyncPipe],
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

  constructor() {
    this.loading.set(true);
    this.restService.getAllConversations().subscribe({
      next: (conversations) => this.conversations.set(conversations),
      complete: () => this.loading.set(false),
    });
  }

  createNewConversation(event: AutoCompleteSelectEvent) {
    this.newConversation.set(new ConversationDTO(this.authService.session()!._id, event.value._id));
    this.searchInput.next('');
  }
}
