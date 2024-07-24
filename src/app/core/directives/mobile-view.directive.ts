import { Directive, effect, ElementRef, inject } from '@angular/core';
import { ScreenService } from '@core/services/screen.service';

@Directive({
  selector: '[MobileView]',
  standalone: true,
})
export class MobileViewDirective {
  private elementRef = inject(ElementRef);
  mobileView = inject(ScreenService).mobileView;

  constructor() {
    effect(() => {
      const mobileView = this.mobileView();
      const element = this.elementRef.nativeElement as HTMLElement;
      element.classList.toggle('mobile-view', mobileView);
    });
  }
}
