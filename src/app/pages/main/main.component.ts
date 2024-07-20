import { Component } from '@angular/core';
import { MenuBarComponent } from '../../core/components/menu-bar/menu-bar.component';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MenuBarComponent, ConversationListComponent, ChatComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
