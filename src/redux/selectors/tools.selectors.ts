import { createSelector } from '@ngrx/store';
import { ToolDescription } from 'src/constants/models/tools';
import { selectToolsState } from './index.selectors';

export const selectToolDescription = (id: string) =>
  createSelector(selectToolsState, (data: ToolDescription[]) => data.find((el) => el.id === id));
