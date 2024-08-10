import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/services/auth.service';
import { AvatarService } from '@core/services/avatar.service';
import { TOASTER_TYPE, ToasterService } from '@core/services/toastr.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-change-avatar-dialog',
  standalone: true,
  imports: [ButtonModule, DividerModule],
  templateUrl: './change-avatar-dialog.component.html',
  styleUrl: './change-avatar-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-panel' },
})
export class ChangeAvatarDialogComponent {
  private avatarService = inject(AvatarService);
  private authService = inject(AuthService);
  private toasterService = inject(ToasterService);

  protected PLACEHOLDER = 'avatar-placeholder.webp';
  protected avatar = signal<string>(this.PLACEHOLDER);
  protected uploading = signal<boolean>(false);
  protected deleting = signal<boolean>(false);

  constructor() {
    this.avatarService
      .getUserAvatar(this.authService.user()!._id)
      .pipe(takeUntilDestroyed())
      .subscribe((avatar) => avatar && this.avatar.set(avatar));
  }

  protected onAvatarInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (!file) return;
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

    const reader = new FileReader();
    reader.onload = () => {
      if (!validImageTypes.includes(file.type)) {
        return this.toasterService.open({
          type: TOASTER_TYPE.ERROR,
          title: 'Invalid File Type',
        });
      }

      if (file.size > maxSizeInBytes) {
        return this.toasterService.open({
          type: TOASTER_TYPE.ERROR,
          title: 'File Size Exceeded',
        });
      }
      this.uploading.set(true);
      const avatar = new Blob([reader.result as ArrayBuffer], { type: 'image/webp' });
      this.avatarService.uploadAvatar(this.authService.user()!._id, avatar).subscribe((avatar) => {
        avatar && this.avatar.set(avatar);
        this.uploading.set(false);
      });
    };
    reader.readAsArrayBuffer(file);
    input.value = '';
  }

  protected deleteAvatar() {
    this.deleting.set(true);
    this.avatarService.deleteAvatar(this.authService.user()!._id).subscribe(() => {
      this.avatar.set('avatar-placeholder.webp');
      this.deleting.set(false);
    });
  }
}
