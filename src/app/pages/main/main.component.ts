import { Component } from '@angular/core';
import { MenuBarComponent } from '../../core/components/menu-bar/menu-bar.component';
import { ContactListComponent } from '../../core/components/contact-list/contact-list.component';
import { ChatComponent } from '../../core/components/chat/chat.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MenuBarComponent, ContactListComponent, ChatComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
