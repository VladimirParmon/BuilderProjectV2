import { createSelector } from '@ngrx/store';
import { UtilsService } from 'src/app/services/utils.service';
import { MediaFileTypes, ToolNames } from 'src/constants/constants';
import {
  BasicFileDescription,
  ImageFileDescription,
  MultimediaFilesCategories,
  StorageUnitTypes,
  TextDescription,
} from 'src/constants/models/files';
import { selectFilesState } from './index.selectors';

export const getSingleFile = (id: string, type: ToolNames) => {
  const fileType = UtilsService.getFileTypeFromToolType(type) as MediaFileTypes;
  return createSelector(selectFilesState, (data: MultimediaFilesCategories) =>
    (data[fileType] as Array<StorageUnitTypes>).find((el) => el.id === id)
  );
};

export const getMultipleFiles = (ids: string[], type: ToolNames) => {
  const fileType = UtilsService.getFileTypeFromToolType(type) as MediaFileTypes;
  return createSelector(selectFilesState, (data: MultimediaFilesCategories) => {
    const shelf = data[fileType] as Array<
      TextDescription | ImageFileDescription | BasicFileDescription
    >;
    const searchResult = ids.map((id) => shelf.find((el) => el.id === id)).filter((r) => r);
    if (searchResult.length === 0) return null;
    return searchResult;
  });
};
