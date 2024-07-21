import { Component, input } from '@angular/core';
import { Message } from '@core/models/message';
import { User } from '@core/models/user';
import { AvatarComponent } from '@ui';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  host: { '[class.own-message]': 'ownMessage()' },
})
export class MessageComponent {
  message = input.required<Message>();
  ownMessage = input.required<boolean>();
  user = input.required<User>();
}
