import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { User } from '../../../core/models/user';
import { AvatarService } from '../../../core/services/avatar.service';

type Size = 'normal' | 'large' | 'xlarge';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [AvatarModule, SkeletonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  host: {
    '[class]': '[size(), textPosition()]',
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
        this.avatarService.getUserAvatar(user._id).subscribe({
          next: (avatar) => {
            this.avatar.set(avatar);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      });
    });
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
