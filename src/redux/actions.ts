import { createAction, props } from '@ngrx/store';
import { JSONDataStorage } from '../constants/models';

export enum ActionTypes {
  retrieveFromJSONSuccess = '[Server call/Load project] Save retrieved from the local JSON file data',
  updateAllFiles = '[Storage/All files] Write to the entire files storage',
  updateText = '[Storage/Text] Update contents of a text block',
}

export const saveRetrievedData = createAction(
  ActionTypes.retrieveFromJSONSuccess,
  props<{ data: JSONDataStorage }>()
);
