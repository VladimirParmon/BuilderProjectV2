import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { JSONDataStorage } from 'src/constants/models';
import { globalActions } from 'src/redux/actions/global.actions';
import * as myJSON from 'src/assets/mock.json';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  isContentsMenuOpen$ = new BehaviorSubject(true);
  isGlobalEditOn$ = new BehaviorSubject(true);
  isDummy$ = new BehaviorSubject(false);
  currentPageId$ = new Subject<string>();
  currentlyInFullscreen$ = new BehaviorSubject(false);

  constructor(private http: HttpClient, private store: Store) {}

  getData(): void {
    const { isDummy, ...storage } = myJSON;
    if (isDummy) {
      this.isGlobalEditOn$.next(false);
      this.isDummy$.next(true);
    }
    const data = storage as JSONDataStorage;
    this.store.dispatch(globalActions.saveRetrievedData({ data }));
  }
}
