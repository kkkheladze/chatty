import { Component, computed, input } from '@angular/core';
import { AvatarComponent } from '@ui';
import { Chat } from '../../../../core/models/chat';

@Component({
  selector: 'app-chat-preview',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './chat-preview.component.html',
  styleUrl: './chat-preview.component.scss',
  host: { class: 'p-panel' },
})
export class ChatComponent {
  chat = input.required<Chat>();
  lastUpdated = computed<string>(() => this.getLastUpdated());

  private getLastUpdated() {
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
        return `${secondsAgo} s`;
      default:
        return 'Just now';
    }

    if (yearsAgo > 0) {
      return `${yearsAgo} Y`;
    } else if (monthsAgo > 0) {
      return `${monthsAgo} M`;
    } else if (weeksAgo > 0) {
      return `${weeksAgo} W`;
    } else if (daysAgo > 0) {
      return `${daysAgo} D`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} H`;
    } else if (minutesAgo > 0) {
      return `${minutesAgo} M`;
    } else if (secondsAgo > 0) {
      return secondsAgo ? `${secondsAgo} S` : 'Just now';
    }
  }
}
