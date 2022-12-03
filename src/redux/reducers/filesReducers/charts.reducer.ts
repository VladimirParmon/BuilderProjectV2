import { createReducer, on } from '@ngrx/store';
import { initialState } from 'src/redux/';

export const chartsReducer = createReducer(initialState.files.charts);
