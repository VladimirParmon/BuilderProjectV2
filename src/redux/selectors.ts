import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UtilsService } from 'src/app/services/utils.service';
import {
  FileDescription,
  ImageDescription,
  Junction,
  MultimediaFiles,
  SinglePageInfo,
  TextFieldDescription,
  ToolNames,
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

export const getPagesUsingIds = (ids: string[]) =>
  createSelector(selectContentsListState, (data: SinglePageInfo[]) =>
    data.filter((el) => ids.includes(el.id))
  );

export const getOnePageInfo = (id: string) =>
  createSelector(selectContentsListState, (data: SinglePageInfo[]) =>
    data.find((el) => el.id === id)
  );

export const getSingleFile = (props: { id: string; type: ToolNames }) => {
  const fileType = UtilsService.getFileTypeFromToolType(
    props.type
  ) as MediaFileTypes;
  return createSelector(selectFilesState, (data: MultimediaFiles) =>
    (
      data[fileType] as Array<
        TextFieldDescription | ImageDescription | FileDescription
      >
    ).find((el) => el.id === props.id)
  );
};

export const getMultipleFiles = (props: { ids: string[]; type: ToolNames }) => {
  const fileType = UtilsService.getFileTypeFromToolType(
    props.type
  ) as MediaFileTypes;
  return createSelector(selectFilesState, (data: MultimediaFiles) => {
    const shelf = data[fileType] as Array<
      TextFieldDescription | ImageDescription | FileDescription
    >;
    return props.ids.map((id) => shelf.find((el) => el.id === id));
  });
};

export const selectJunction = (id: string) =>
  createSelector(selectJunctionsState, (data: Junction[]) =>
    data.find((el) => el.id === id)
  );
