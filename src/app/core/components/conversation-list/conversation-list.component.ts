import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, catchError, switchMap } from 'rxjs';
import { Conversation, ConversationDTO } from '../../models/conversation';
import { AuthService } from '../../services/auth.service';
import { RestService } from '../../services/rest.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AutoCompleteModule, ButtonModule, AvatarModule, AsyncPipe],
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

  constructor() {
    this.restService.getAllConversations().subscribe({
      next: (conversations) => this.conversations.set(conversations),
      error: () => null,
    });
  }

  createNewConversation(event: AutoCompleteSelectEvent) {
    this.newConversation.set(new ConversationDTO(this.authService.session()!._id, event.value._id));
    this.searchInput.next('');
  }
}
