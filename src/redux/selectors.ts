import { createSelector, createFeatureSelector } from '@ngrx/store';
import {
  FileDescription,
  ImageDescription,
  Junction,
  MultimediaFiles,
  SinglePageInfo,
  TextField,
  Tools,
  MediaFileTypes,
} from '../constants/models';

const selectContentsListState =
  createFeatureSelector<SinglePageInfo[]>('contentsList');
const selectFilesState = createFeatureSelector<MultimediaFiles>('files');
const selectJunctionsState = createFeatureSelector<Junction[]>('junctions');

export const selectAllPagesInfo = createSelector(
  selectContentsListState,
  (data: SinglePageInfo[]) => data
);

export const getOnePageInfo = (id: string) =>
  createSelector(selectContentsListState, (data: SinglePageInfo[]) =>
    data.filter((el) => el.id === id)
  );

export const getFiles = (props: { id: string; type: Tools }) => {
  let fileType: keyof MultimediaFiles;
  switch (props.type) {
    case Tools.TEXT:
      fileType = MediaFileTypes.TEXT;
      break;
    case Tools.AUDIO:
      fileType = MediaFileTypes.AUDIOS;
      break;
    case Tools.PDF:
      fileType = MediaFileTypes.PDFs;
      break;
    case Tools.VIDEO:
      fileType = MediaFileTypes.VIDEOS;
      break;
  }

  return createSelector(selectFilesState, (data: MultimediaFiles) =>
    (
      data[fileType] as Array<TextField | ImageDescription | FileDescription>
    ).filter((el) => el.id === props.id)
  );
};

export const selectJunctions = (id: string) =>
  createSelector(selectJunctionsState, (data: Junction[]) =>
    data.filter((el) => el.id === id)
  );
