import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  isMenuOpen: boolean = false;
  constructor(public stateService: StateService) {
    this.subscription = this.stateService.isContentsMenuOpen$.subscribe(
      (data) => (this.isMenuOpen = data)
    );
  }
  subscription: Subscription;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleMenu() {
    this.stateService.isContentsMenuOpen$.next(!this.isMenuOpen);
  }
}
