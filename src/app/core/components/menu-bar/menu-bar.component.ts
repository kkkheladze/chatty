import { Component, inject } from '@angular/core';
import { MobileViewDirective } from '@core/directives/mobile-view.directive';
import { AvatarComponent } from '@ui';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [MenubarModule, MenuModule, AvatarComponent],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
  hostDirectives: [MobileViewDirective],
})
export class MenuBarComponent {
  private authService = inject(AuthService);
  protected mobileView = inject(MobileViewDirective).mobileView;

  protected user = this.authService.user;
  protected menuItems: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.logout();
      },
      iconStyle: { color: 'var(--red-500)' },
    },
  ];
}
