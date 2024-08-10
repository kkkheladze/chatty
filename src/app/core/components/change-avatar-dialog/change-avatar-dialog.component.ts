import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-change-avatar-dialog',
  standalone: true,
  imports: [],
  templateUrl: './change-avatar-dialog.component.html',
  styleUrl: './change-avatar-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-panel' },
})
export class ChangeAvatarDialogComponent {}
