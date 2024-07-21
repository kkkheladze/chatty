import { Component, inject } from '@angular/core';
import { ScreenService } from '@core/services/screen.service';
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
})
export class MenuBarComponent {
  private authService = inject(AuthService);
  mobileView = inject(ScreenService).mobileView;

  user = this.authService.user;
  menuItems: MenuItem[] = [
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
