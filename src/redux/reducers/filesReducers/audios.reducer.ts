import { createReducer, on } from '@ngrx/store';
import { filesActions } from 'src/redux/actions/files.actions';
import { initialState } from 'src/redux/';

export const audiosReducer = createReducer(
  initialState.files.audios,
  on(filesActions.insertNewAudioFilesDescriptions, (state, { filesDescriptions }) => [
    ...state,
    ...filesDescriptions,
  ])
);
