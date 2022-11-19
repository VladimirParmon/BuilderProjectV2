import { createReducer, on } from '@ngrx/store';
import { globalActions } from 'src/redux/actions/global.actions';
import { filesActions } from 'src/redux/actions/files.actions';
import { initialState } from './index.reducers';

export const filesReducer = createReducer(
  initialState.files,
  on(globalActions.saveRetrievedData, (state, { data }) => data.files),
  on(filesActions.insertNewTextStorageUnit, (state, { textDescription }) => {
    return {
      ...state,
      text: [...state.text, textDescription],
    };
  }),
  on(filesActions.updateTextStorageUnit, (state, { id, newText }) => ({
    ...state,
    text: state.text.map((el) => (el.id === id ? { ...el, text: newText } : el)),
  })),
  on(filesActions.insertNewImageFilesDescriptions, (state, { filesDescriptions }) => {
    return {
      ...state,
      images: [...state.images, ...filesDescriptions],
    };
  }),
  on(filesActions.insertNewAudioFilesDescriptions, (state, { filesDescriptions }) => {
    return {
      ...state,
      audios: [...state.images, ...filesDescriptions],
    };
  }),
  on(filesActions.insertNewPDFFilesDescriptions, (state, { filesDescriptions }) => {
    return {
      ...state,
      PDFs: [...state.images, ...filesDescriptions],
    };
  }),
  on(filesActions.deleteTextStorageUnit, (state, { id }) => ({
    ...state,
    text: state.text.filter((u) => u.id !== id),
  }))
);
