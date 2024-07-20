import { Component, computed, input } from '@angular/core';
import { AvatarComponent } from '@ui';
import { Conversation, ConversationDTO } from '../../../../core/models/conversation';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss',
  host: { class: 'p-panel' },
})
export class ConversationComponent {
  conversation = input.required<Conversation>();
  lastUpdated = computed<string>(() => this.getLastUpdated());

  private getLastUpdated() {
    const updatedAt = (this.conversation() as Conversation).updatedAt;

    const timeDifference = new Date().getTime() - new Date(updatedAt).getTime();
    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const weeksAgo = Math.floor(daysAgo / 7);
    const monthsAgo = Math.floor(daysAgo / 30);
    const yearsAgo = Math.floor(daysAgo / 365);

    if (yearsAgo > 0) {
      return `${yearsAgo}Y`;
    } else if (monthsAgo > 0) {
      return `${monthsAgo}M`;
    } else if (weeksAgo > 0) {
      return `${weeksAgo}W`;
    } else if (daysAgo > 0) {
      return `${daysAgo}D`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo}H`;
    } else if (minutesAgo > 0) {
      return `${minutesAgo}M`;
    } else {
      return secondsAgo ? `${secondsAgo}S` : 'Just now';
    }
  }
}
