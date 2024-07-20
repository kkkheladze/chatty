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
})
export class AvatarComponent {
  private avatarService = inject(AvatarService);

  user = input.required<User>();
  shape = input<'circle' | 'square'>('circle');
  size = input<Size>('normal');
  style = input<{ [key: string]: any }>();
  loadImage = input<boolean>(true);

  avatar = signal<string | undefined>(undefined);
  loading = signal<boolean>(false);
  skeletonSize = computed(() => this.getSkeletonSize());
  initials = computed(() => `${this.user().name[0]}${this.user().lastName[0]}`);

  constructor() {
    effect(() => {
      const user = this.user();
      if (!user) return;

      untracked(() => {
        if (!this.loadImage()) return;
        this.loading.set(true);
        this.avatarService.getUserAvatar(user._id).subscribe({
          next: (avatar) => this.avatar.set(avatar),
          complete: () => this.loading.set(false),
        });
      });
    });
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
