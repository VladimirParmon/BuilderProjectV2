import { createReducer, on } from '@ngrx/store';
import { filesActions } from 'src/redux/actions/files.actions';
import { initialState } from 'src/redux/';

export const videosReducer = createReducer(
  initialState.files.videos,
  on(filesActions.insertNewVideoFileDescription, (state, { fileDescription }) => [
    ...state,
    fileDescription,
  ]),
  on(filesActions.deleteVideo, (state, { storageUnitDescriptionId }) =>
    state.filter((v) => storageUnitDescriptionId !== v.id)
  )
);
