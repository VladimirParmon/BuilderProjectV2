import { ActionReducerMap } from '@ngrx/store';
import { JSONDataStorage } from '../../constants/models';
import { MediaFileTypes } from '../../constants/constants';
import { contentsReducer } from './contents.reducers';
import { filesReducer } from './files.reducers';
import { toolsReducer } from './tools.reducers';

export const initialState: JSONDataStorage = {
  contents: [],
  files: {
    [MediaFileTypes.TEXT]: [],
    [MediaFileTypes.IMAGES]: [],
    [MediaFileTypes.VIDEOS]: [],
    [MediaFileTypes.PDFs]: [],
    [MediaFileTypes.AUDIOS]: [],
  },
  tools: [],
};

export const reducers: ActionReducerMap<JSONDataStorage> = {
  contents: contentsReducer,
  files: filesReducer,
  tools: toolsReducer,
};
