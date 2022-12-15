import { createReducer, on } from '@ngrx/store';
import { initialState } from 'src/redux/';
import { filesActions } from 'src/redux/actions/files.actions';

export const chartsReducer = createReducer(
  initialState.files.charts,
  on(filesActions.insertNewChartDescription, (state, { chartStorageUnitDescription }) => [
    ...state,
    chartStorageUnitDescription,
  ])
);
