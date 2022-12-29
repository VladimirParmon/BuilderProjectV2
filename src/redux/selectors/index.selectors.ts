import { createFeatureSelector } from '@ngrx/store';
import { SinglePageInfo } from 'src/constants/models/contents';
import { MultimediaFilesCategories } from 'src/constants/models/files';
import { ToolDescription } from 'src/constants/models/tools';

export const selectContentsState = createFeatureSelector<SinglePageInfo[]>('contents');
export const selectFilesState = createFeatureSelector<MultimediaFilesCategories>('files');
export const selectToolsState = createFeatureSelector<ToolDescription[]>('tools');
