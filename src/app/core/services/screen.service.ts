import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private breakpointObserver = inject(BreakpointObserver);
  private mobileView$ = this.breakpointObserver.observe('(max-width: 800px)').pipe(map((result) => result.matches));
  mobileView: Signal<boolean> = toSignal(this.mobileView$, { initialValue: false });
}
