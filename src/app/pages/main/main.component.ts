import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MenuBarComponent } from '@core/components/menu-bar/menu-bar.component';
import { MobileViewDirective } from '@core/directives/mobile-view.directive';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ChatPreviewListComponent } from './chat-preview-list/chat-preview-list.component';
import { ChatComponent } from './chat/chat.component';
import { MainService } from './main.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SidebarModule, ButtonModule, NgClass, MenuBarComponent, ChatPreviewListComponent, ChatComponent],
  providers: [MainService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  hostDirectives: [MobileViewDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  protected mobileView = inject(MobileViewDirective).mobileView;
  protected sidebarOpen = signal<boolean>(false);
}
