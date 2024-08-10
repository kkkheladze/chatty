import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MobileViewDirective } from '@core/directives/mobile-view.directive';
import { AvatarComponent } from '@ui';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../services/auth.service';
import { ChangeAvatarDialogComponent } from '../change-avatar-dialog/change-avatar-dialog.component';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [MenubarModule, MenuModule, AvatarComponent],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [MobileViewDirective],
})
export class MenuBarComponent {
  private authService = inject(AuthService);
  private dialogService = inject(Dialog);
  protected mobileView = inject(MobileViewDirective).mobileView;

  protected user = this.authService.user;
  protected menuItems: MenuItem[] = [
    {
      label: 'Change Avatar',
      icon: 'pi pi-image',
      command: () => this.changeAvatarDialog(),
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      iconStyle: { color: 'var(--red-500)' },
      command: () => {
        this.authService.logout();
      },
    },
  ];

  private changeAvatarDialog() {
    this.dialogService.open(ChangeAvatarDialogComponent);
  }
}
