import { Directive, ElementRef, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FullscreenService } from '../services/fullscreen.service';

@Directive({
  selector: '[appFullscreen]',
})
export class FullscreenDirective {
  @Input() isGlobalEditOn: boolean = true;
  currentlyInFullscreen: boolean = false;

  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  screenChange() {
    if (this.document.fullscreenElement) {
      this.currentlyInFullscreen = true;
    } else {
      this.currentlyInFullscreen = false;
    }
  }

  @HostListener('click', ['$event'])
  decideOnFullscreen(event: MouseEvent) {
    if (!this.isGlobalEditOn && !this.currentlyInFullscreen) {
      this.fullscreenService.openFullscreen(event.target);
    } else if (!this.isGlobalEditOn && this.currentlyInFullscreen) {
      this.fullscreenService.closeFullscreen();
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private el: ElementRef,
    private fullscreenService: FullscreenService
  ) {}
}
