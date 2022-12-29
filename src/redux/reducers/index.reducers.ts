import { ActionReducerMap, MetaReducer, ActionReducer } from '@ngrx/store';
import { JSONDataStorage } from 'src/constants/models/general';
import { MultimediaFilesCategories } from 'src/constants/models/files';
import { contentsReducer } from './contents.reducers';
import { combinedFilesReducer } from './files.reducers';
import { toolsReducer } from './tools.reducers';
import { APIActions } from 'src/redux/actions/global.actions';

export const reducers: ActionReducerMap<JSONDataStorage> = {
  contents: contentsReducer,
  files: combinedFilesReducer,
  tools: toolsReducer,
};

export interface ActionWithPayload {
  type: string;
  data: MultimediaFilesCategories;
}

export const updateWholeStore =
  (reducer: ActionReducer<MultimediaFilesCategories, ActionWithPayload>) =>
  (state: MultimediaFilesCategories, action: ActionWithPayload) => {
    if (action.type === APIActions.retrieveFromJSONSuccess) {
      return reducer(action.data, action);
    }
    return reducer(state, action);
  };

export const metaReducers: MetaReducer<any, ActionWithPayload>[] = [updateWholeStore];
