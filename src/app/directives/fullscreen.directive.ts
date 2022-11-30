import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FullscreenService } from '../services/fullscreen.service';

@Directive({
  selector: '[appFullscreen]',
})
export class FullscreenDirective {
  @Input() isGlobalEditOn: boolean | null = true;
  @Input() elementToGoFull: Element | null = null;
  @Input() currentlyInFullscreen: boolean | null = null;
  @Input() ignoreTheClick: boolean | null = null;

  @HostListener('click', ['$event'])
  decideOnFullscreen(event: MouseEvent) {
    if (this.ignoreTheClick) return;
    if (this.elementToGoFull) {
      this.handle(this.elementToGoFull);
    } else {
      if (event.target) this.handle(event.target);
    }
  }

  handle(element: Element | EventTarget) {
    if (!this.currentlyInFullscreen) {
      this.fullscreenService.openFullscreen(element);
    } else {
      this.fullscreenService.closeFullscreen();
    }
  }

  constructor(private el: ElementRef, private fullscreenService: FullscreenService) {}
}
