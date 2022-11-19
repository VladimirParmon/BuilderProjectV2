import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UtilsService } from 'src/app/services/utils.service';
import {
  BasicFileDescription,
  ImageFileDescription,
  ToolDescription,
  MultimediaFilesCategories,
  SinglePageInfo,
  TextDescription,
} from '../constants/models';
import { ToolNames, MediaFileTypes } from '../constants/constants';

const selectContentsState = createFeatureSelector<SinglePageInfo[]>('contents');
const selectFilesState = createFeatureSelector<MultimediaFilesCategories>('files');
const selectToolsState = createFeatureSelector<ToolDescription[]>('tools');

export const selectAllPagesInfo = createSelector(
  selectContentsState,
  (data: SinglePageInfo[]) => data
);

export const getPagesUsingIds = (ids: string[]) =>
  createSelector(selectContentsState, (data: SinglePageInfo[]) =>
    data.filter((el) => ids.includes(el.id))
  );

export const getOnePageInfo = (id: string) =>
  createSelector(selectContentsState, (data: SinglePageInfo[]) => data.find((el) => el.id === id));

export const getSingleFile = (props: { id: string; type: ToolNames }) => {
  const fileType = UtilsService.getFileTypeFromToolType(props.type) as MediaFileTypes;
  return createSelector(selectFilesState, (data: MultimediaFilesCategories) =>
    (data[fileType] as Array<TextDescription | ImageFileDescription | BasicFileDescription>).find(
      (el) => el.id === props.id
    )
  );
};

export const getMultipleFiles = (props: { ids: string[]; type: ToolNames }) => {
  const fileType = UtilsService.getFileTypeFromToolType(props.type) as MediaFileTypes;
  return createSelector(selectFilesState, (data: MultimediaFilesCategories) => {
    const shelf = data[fileType] as Array<
      TextDescription | ImageFileDescription | BasicFileDescription
    >;
    return props.ids.map((id) => shelf.find((el) => el.id === id));
  });
};

export const selectToolDescription = (id: string) =>
  createSelector(selectToolsState, (data: ToolDescription[]) => data.find((el) => el.id === id));
