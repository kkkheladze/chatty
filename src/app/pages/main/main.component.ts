import { Component } from '@angular/core';
import { MenuBarComponent } from '../../core/components/menu-bar/menu-bar.component';
import { ChatPreviewListComponent } from './chat-preview-list/chat-preview-list.component';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MenuBarComponent, ChatPreviewListComponent, ChatComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
