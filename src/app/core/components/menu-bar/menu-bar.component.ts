import { Component, computed, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../services/auth.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [MenubarModule, AvatarModule, MenuModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
})
export class MenuBarComponent {
  private authService = inject(AuthService);

  session = computed(() => this.authService.session()!);
  fullName = computed<string>(() => `${this.session().name} ${this.session().lastName}` || '');
  initials = computed<string>(() => this.session().name[0]);
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
