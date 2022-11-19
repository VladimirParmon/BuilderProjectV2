import { createAction, props } from '@ngrx/store';
import { JSONDataStorage } from 'src/constants/models';

enum APIActions {
  retrieveFromJSONSuccess = '[Server call/Load project] Save retrieved from the local JSON file data',
}

const saveRetrievedData = createAction(
  APIActions.retrieveFromJSONSuccess,
  props<{ data: JSONDataStorage }>()
);

export const globalActions = {
  saveRetrievedData,
};
