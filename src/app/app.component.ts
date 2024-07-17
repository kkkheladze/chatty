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
    this.initTheme();
  }

  private initTheme() {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      const lightMode = e.matches;
      const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
      if (!themeLink) return;

      themeLink.href = `${lightMode ? 'light' : 'dark'}.css`;
    });
  }
}
