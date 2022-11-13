import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JSONDataStorage } from 'src/constants/models';
import { globalActions } from 'src/redux/actions';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _jsonURL = 'assets/mock.json';

  constructor(private http: HttpClient, private store: Store) {}

  getData(): void {
    //TODO: http call
    this.http.get(this._jsonURL).subscribe((res) => {
      const retrievedData = res as JSONDataStorage;
      this.store.dispatch(
        globalActions.saveRetrievedData({ data: retrievedData })
      );
    });
  }
}
