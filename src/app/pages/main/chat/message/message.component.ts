import { Component, input } from '@angular/core';
import { AvatarComponent } from '@ui';
import { Message } from '../../../../core/models/message';
import { User } from '../../../../core/models/user';

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
