import { combineReducers } from '@ngrx/store';
import { PDFsReducer } from './filesReducers/PDFs.reducer';
import { audiosReducer } from './filesReducers/audios.reducer';
import { imagesReducer } from './filesReducers/images.reducer';
import { textReducer } from './filesReducers/text.reducer';
import { videosReducer } from './filesReducers/videos.reducer';
import { chartsReducer } from './filesReducers/charts.reducer';

export const combinedFilesReducer = combineReducers({
  PDFs: PDFsReducer,
  audios: audiosReducer,
  images: imagesReducer,
  text: textReducer,
  videos: videosReducer,
  charts: chartsReducer,
});
