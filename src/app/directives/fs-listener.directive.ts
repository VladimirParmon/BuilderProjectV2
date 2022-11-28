import { Directive, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StateService } from '../services/state.service';

@Directive({
  selector: '[appFsListener]',
})
export class FsListenerDirective {
  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  screenChange() {
    if (this.document.fullscreenElement) {
      this.stateService.currentlyInFullscreen$.next(true);
    } else {
      this.stateService.currentlyInFullscreen$.next(false);
    }
  }

  constructor(@Inject(DOCUMENT) private document: Document, private stateService: StateService) {}
}
