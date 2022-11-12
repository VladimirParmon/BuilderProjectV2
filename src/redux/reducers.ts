import { createReducer, on } from '@ngrx/store';
import { saveRetrievedData } from './actions';
import { JSONDataStorage, MediaFileTypes } from '../constants/models';

export const initialState: JSONDataStorage = {
  contentsList: [],
  files: {
    [MediaFileTypes.TEXT]: [],
    [MediaFileTypes.IMAGES]: [],
    [MediaFileTypes.VIDEOS]: [],
    [MediaFileTypes.PDFs]: [],
    [MediaFileTypes.AUDIOS]: [],
  },
  junctions: [],
};

export const filesReducer = createReducer(
  initialState,
  on(saveRetrievedData, (state, { data }) => data)
);
