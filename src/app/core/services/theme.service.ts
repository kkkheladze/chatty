import { effect, Injectable, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, startWith } from 'rxjs';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private matchMedia = window.matchMedia('(prefers-color-scheme: light)');
  private themeLink = document.getElementById('app-theme') as HTMLLinkElement;
  private systemPrefChanged$ = fromEvent<MediaQueryListEvent>(this.matchMedia, 'change').pipe(
    startWith(this.matchMedia),
    map((e) => e.matches)
  );
  private systemPrefference = toSignal(this.systemPrefChanged$);
  private readonly DEFAULT_THEME: Theme = 'dark';
  private readonly STORAGE_KEY = 'theme';

  activeTheme = signal<Theme>(this.DEFAULT_THEME);

  constructor() {
    effect(() => {
      // Runs when system preference changes
      const systemPrefLight = this.systemPrefference();

      let theme: Theme = this.DEFAULT_THEME;
      const userPref = localStorage.getItem(this.STORAGE_KEY);
      if (userPref === 'light') theme = 'light';
      else if (userPref === 'dark') theme = 'dark';
      else if (systemPrefLight) theme = 'light';
      else theme = 'dark';
      untracked(() => this.setTheme(theme));
    });
  }

  setTheme(theme: Theme, userPrefference = false) {
    {
      this.themeLink.href = `${theme}.css`;
      this.activeTheme.set(theme);
      if (userPrefference) localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }
}
