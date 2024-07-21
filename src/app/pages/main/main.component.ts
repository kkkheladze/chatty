import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MenuBarComponent } from '@core/components/menu-bar/menu-bar.component';
import { MobileViewDirective } from '@core/directives/mobile-view.directive';
import { ScreenService } from '@core/services/screen.service';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ChatPreviewListComponent } from './chat-preview-list/chat-preview-list.component';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SidebarModule, ButtonModule, NgClass, MenuBarComponent, ChatPreviewListComponent, ChatComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  hostDirectives: [MobileViewDirective],
})
export class MainComponent {
  mobileView = inject(ScreenService).mobileView;
  sidebarOpen = signal<boolean>(false);
}
