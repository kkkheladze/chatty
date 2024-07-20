import { Component, computed, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../services/auth.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarComponent } from '@ui';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [MenubarModule, MenuModule, AvatarComponent],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
})
export class MenuBarComponent {
  private authService = inject(AuthService);

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
