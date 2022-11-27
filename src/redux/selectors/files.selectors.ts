import { createSelector } from '@ngrx/store';
import { UtilsService } from 'src/app/services/utils.service';
import { MediaFileTypes, ToolNames } from 'src/constants/constants';
import {
  BasicFileDescription,
  ImageFileDescription,
  MultimediaFilesCategories,
  TextDescription,
} from 'src/constants/models';
import { selectFilesState } from './index.selectors';

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
    const searchResult = props.ids.map((id) => shelf.find((el) => el.id === id)).filter((r) => r);
    if (searchResult.length === 0) return null;
    return searchResult;
  });
};
