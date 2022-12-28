import { createAction, props } from '@ngrx/store';
import { ImageFileDescription } from 'src/constants/models';

enum ImagesActions {
  insertImages = '[Files/Image] Insert new images to the files storage',
  updateImageWidth = '[Files/Image] Update the width of an image',
  deleteImage = '[Files/Image] Delete an image file description from store',
  deleteMultipleImages = '[Files/Image] Delete multiple image file descriptions from store',
}

const insertNewImageFilesDescriptions = createAction(
  ImagesActions.insertImages,
  props<{ filesDescriptions: ImageFileDescription[] }>()
);

const updateImageWidth = createAction(
  ImagesActions.updateImageWidth,
  props<{ imageDescriptionId: string; newWidth: number }>()
);

const deleteImage = createAction(ImagesActions.deleteImage, props<{ fileDescriptionId: string }>());

const deleteMultipleImages = createAction(
  ImagesActions.deleteMultipleImages,
  props<{ fileDescriptionIds: string[] }>()
);

export const imagesActions = {
  insertNewImageFilesDescriptions,
  updateImageWidth,
  deleteImage,
  deleteMultipleImages,
};
