import { createReducer, on } from '@ngrx/store';
import { globalActions } from 'src/redux/actions/global.actions';
import { filesActions } from 'src/redux/actions/files.actions';
import { initialState } from 'src/redux/';

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
      PDFs: [...state.PDFs, ...filesDescriptions],
    };
  }),
  on(filesActions.deleteTextStorageUnit, (state, { id }) => ({
    ...state,
    text: state.text.filter((u) => u.id !== id),
  })),
  on(filesActions.updateImageWidth, (state, { imageDescriptionId, newWidth }) => ({
    ...state,
    images: state.images.map((image) =>
      image.id === imageDescriptionId ? { ...image, width: newWidth } : image
    ),
  })),
  on(filesActions.deleteImage, (state, { fileDescriptionId }) => ({
    ...state,
    images: state.images.filter((i) => i.id !== fileDescriptionId),
  })),
  on(filesActions.deleteMultipleImages, (state, { imageDescriptionIds }) => ({
    ...state,
    images: state.images.filter((i) => !imageDescriptionIds.includes(i.id)),
  })),
  on(filesActions.deletePDF, (state, { fileDescriptionId }) => ({
    ...state,
    PDFs: state.PDFs.filter((p) => fileDescriptionId !== p.id),
  })),
  on(filesActions.deleteMultiplePDFs, (state, { fileDescriptionIds }) => ({
    ...state,
    PDFs: state.PDFs.filter((p) => !fileDescriptionIds.includes(p.id)),
  }))
);
