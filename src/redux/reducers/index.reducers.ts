import { ActionReducerMap } from '@ngrx/store';
import { JSONDataStorage } from '../../constants/models';
import { contentsReducer } from './contents.reducers';
import { filesReducer } from './files.reducers';
import { toolsReducer } from './tools.reducers';

export const reducers: ActionReducerMap<JSONDataStorage> = {
  contents: contentsReducer,
  files: filesReducer,
  tools: toolsReducer,
};
