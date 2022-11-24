import { createAction, props } from '@ngrx/store';
import {
  TextDescription,
  ImageFileDescription,
  AudioFileDescription,
  PDFFileDescription,
  VideoFileDescription,
} from 'src/constants/models';

enum FileActions {
  updateText = '[Files/Text] Update the description of a text unit',
  insertText = '[Files/Text] Insert a new text unit',
  insertImages = '[Files/Image] Insert new images to the files storage',
  insertVideo = '[Files/Video] Insert a new video to the files storage',
  insertPDF = '[Files/PDF] Insert a new PDF to the files storage',
  insertAudio = '[Files/Audio] Insert a new audio to the files storage',
  deleteText = '[Files/Text] Delete a text storage unit',
  updateImageWidth = '[Files/Image] Update the width of an image',
  deleteImage = '[File/Image] Delete an image file description from store',
  deleteMultipleImages = '[File/Image] Delete multiple image file descriptions from store',
}

const updateTextStorageUnit = createAction(
  FileActions.updateText,
  props<{ id: string; newText: string }>()
);
const insertNewTextStorageUnit = createAction(
  FileActions.insertText,
  props<{ textDescription: TextDescription }>()
);
const insertNewImageFilesDescriptions = createAction(
  FileActions.insertImages,
  props<{ filesDescriptions: ImageFileDescription[] }>()
);
const insertNewVideoFileDescription = createAction(
  FileActions.insertVideo,
  props<{ fileDescription: VideoFileDescription }>()
);
const insertNewPDFFilesDescriptions = createAction(
  FileActions.insertPDF,
  props<{ filesDescriptions: PDFFileDescription[] }>()
);
const insertNewAudioFilesDescriptions = createAction(
  FileActions.insertAudio,
  props<{ filesDescriptions: AudioFileDescription[] }>()
);
const deleteTextStorageUnit = createAction(FileActions.deleteText, props<{ id: string }>());
const updateImageWidth = createAction(
  FileActions.updateImageWidth,
  props<{ imageDescriptionId: string; newWidth: number }>()
);
const deleteImage = createAction(FileActions.deleteImage, props<{ imageDescriptionId: string }>());
const deleteMultipleImages = createAction(
  FileActions.deleteMultipleImages,
  props<{ imageDescriptionIds: string[] }>()
);

export const filesActions = {
  updateTextStorageUnit,
  insertNewTextStorageUnit,
  insertNewImageFilesDescriptions,
  insertNewAudioFilesDescriptions,
  insertNewPDFFilesDescriptions,
  deleteTextStorageUnit,
  insertNewVideoFileDescription,
  updateImageWidth,
  deleteImage,
  deleteMultipleImages,
};
