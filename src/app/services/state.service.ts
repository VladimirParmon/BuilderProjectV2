import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { JSONDataStorage } from 'src/constants/models';
import { globalActions } from 'src/redux/actions/global.actions';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  isContentsMenuOpen$ = new BehaviorSubject(true);
  isGlobalEditOn$ = new BehaviorSubject(true);
  currentPageId$ = new Subject<string>();
  currentlyInFullscreen$ = new BehaviorSubject(false);

  constructor(private http: HttpClient, private store: Store) {}

  getData(): void {
    this.http.get<JSONDataStorage>('http://127.0.0.1:3000/getTree').subscribe((data) => {
      this.store.dispatch(globalActions.saveRetrievedData({ data }));
    });
  }
}
