import { createReducer, on } from '@ngrx/store';
import { filesActions } from 'src/redux/actions/files.actions';
import { initialState } from 'src/redux/';

export const imagesReducer = createReducer(
  initialState.files.images,
  on(filesActions.insertNewImageFilesDescriptions, (state, { filesDescriptions }) => [
    ...state,
    ...filesDescriptions,
  ]),
  on(filesActions.updateImageWidth, (state, { imageDescriptionId, newWidth }) =>
    state.map((image) => (image.id === imageDescriptionId ? { ...image, width: newWidth } : image))
  ),
  on(filesActions.deleteImage, (state, { fileDescriptionId }) =>
    state.filter((i) => i.id !== fileDescriptionId)
  ),
  on(filesActions.deleteMultipleImages, (state, { imageDescriptionIds }) =>
    state.filter((i) => !imageDescriptionIds.includes(i.id))
  )
);
