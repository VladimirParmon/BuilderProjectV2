import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isContentsMenuOpen$: BehaviorSubject<boolean> = this.stateService.isContentsMenuOpen$;
  constructor(public stateService: StateService) {}

  toggleMenu(state: boolean) {
    this.stateService.isContentsMenuOpen$.next(!state);
  }
}
