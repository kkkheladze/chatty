import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@core/models/user';
import { AvatarService } from '@core/services/avatar.service';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { filter, switchMap, tap } from 'rxjs';

type Size = 'normal' | 'large' | 'xlarge';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [AvatarModule, SkeletonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '[size()]',
    '[class.text-left]': 'textPosition() === "left"',
  },
})
export class AvatarComponent {
  private avatarService = inject(AvatarService);

  user = input.required<User>();
  shape = input<'circle' | 'square'>('circle');
  size = input<Size>('normal');
  style = input<{ [key: string]: any }>();
  withText = input<boolean>(true);
  description = input<string>('');
  textPosition = input<'left' | 'right'>('right');
  loadImage = input<boolean>(true);

  avatar = signal<string | undefined>(undefined);
  loading = signal<boolean>(false);
  skeletonSize = computed(() => this.getSkeletonSize());
  initials = computed(() => this.getInitials());

  constructor() {
    effect(() => {
      const user = this.user();
      if (!user) return;

      untracked(() => {
        if (!this.loadImage()) return;
        this.loading.set(true);
        this.avatarService.getUserAvatar(user._id).subscribe((avatar) => {
          this.avatar.set(avatar);
          this.loading.set(false);
        });
      });
    });

    this.avatarService.avatarChanged
      .pipe(
        filter((id) => id === this.user()?._id),
        switchMap((id) => this.avatarService.getUserAvatar(id!)),
        tap((avatar) => this.avatar.set(avatar)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private getInitials() {
    const user = this.user();
    if (!user) return '';
    return `${user.name[0]}${user.lastName[0]}`;
  }

  private getSkeletonSize() {
    switch (this.size()) {
      case 'normal':
        return '2rem';
      case 'large':
        return '3rem';
      case 'xlarge':
        return '4rem';
      default:
        return '1rem';
    }
  }
}
