import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Message } from '@core/models/message';
import { User } from '@core/models/user';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.own-message]': 'ownMessage()' },
})
export class MessageComponent {
  message = input.required<Message>();
  ownMessage = input.required<boolean>();
  lastMessage = input.required<boolean>();
  user = input.required<User>();
  text = computed<string>(() => this.message().text);
  time = computed<string>(() => this.getFormatedTime());
  status = computed<string>(() => this.message().status);

  private getFormatedTime() {
    const dateObj = new Date(this.message().sentAt);
    const hours = dateObj.getHours();
    return hours.toString().padStart(2, '0') + ':' + dateObj.getMinutes().toString().padStart(2, '0');
  }
}
