import { Component } from '@angular/core';
import { MenuBarComponent } from '../../core/components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MenuBarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
