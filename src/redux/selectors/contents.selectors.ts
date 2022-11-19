import { createSelector } from '@ngrx/store';
import { SinglePageInfo } from 'src/constants/models';
import { selectContentsState } from './index.selectors';

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
