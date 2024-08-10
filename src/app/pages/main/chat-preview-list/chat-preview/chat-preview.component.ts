import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chat } from '@core/models/chat';
import { AvatarComponent } from '@ui';
import { filter, timer } from 'rxjs';

@Component({
  selector: 'app-chat-preview',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './chat-preview.component.html',
  styleUrl: './chat-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-panel' },
})
export class ChatComponent {
  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  chat = input.required<Chat>();
  timer = toSignal(timer(0, 1000 * 60).pipe(filter(() => this.elementRef.nativeElement.checkVisibility())), { initialValue: 0 });
  lastUpdated = computed<string>(() => this.getLastUpdated());

  private getLastUpdated() {
    this.timer();
    const updatedAt = (this.chat() as Chat).updatedAt;

    const timeDifference = new Date().getTime() - new Date(updatedAt).getTime();
    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const weeksAgo = Math.floor(daysAgo / 7);
    const monthsAgo = Math.floor(daysAgo / 30);
    const yearsAgo = Math.floor(daysAgo / 365);

    switch (true) {
      case yearsAgo > 0:
        return `${yearsAgo} Y`;
      case monthsAgo > 0:
        return `${monthsAgo} M`;
      case weeksAgo > 0:
        return `${weeksAgo} w`;
      case daysAgo > 0:
        return `${daysAgo} d`;
      case hoursAgo > 0:
        return `${hoursAgo} h`;
      case minutesAgo > 0:
        return `${minutesAgo} m`;
      case secondsAgo > 0:
        return `1 m<`;
      default:
        return 'Just now';
    }
  }
}
