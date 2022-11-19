import { createFeatureSelector } from '@ngrx/store';
import { ToolDescription, MultimediaFilesCategories, SinglePageInfo } from 'src/constants/models';

export const selectContentsState = createFeatureSelector<SinglePageInfo[]>('contents');
export const selectFilesState = createFeatureSelector<MultimediaFilesCategories>('files');
export const selectToolsState = createFeatureSelector<ToolDescription[]>('tools');
