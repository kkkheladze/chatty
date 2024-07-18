import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  template: `<router-outlet /><p-toast />`,
})
export class AppComponent {
  constructor() {
    const lightThemeMedia = window.matchMedia('(prefers-color-scheme: light)');
    this.setTheme(lightThemeMedia.matches);
    lightThemeMedia.addEventListener('change', (e) => this.setTheme(e.matches));
  }

  private setTheme(light: boolean) {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    themeLink.href = `${light ? 'light' : 'dark'}.css`;
  }
}
