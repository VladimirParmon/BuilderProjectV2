import { createAction, props } from '@ngrx/store';
import { ChartDescription, JSONString } from 'src/constants/models/charts';

enum ChartActions {
  insertNewChart = '[Files/Charts] Insert a new chart storage unit',
  updateChart = '[Files/Charts] Update chart data',
  deleteChart = '[Files/Charts] Delete chart data',
}

const insertNewChartDescription = createAction(
  ChartActions.insertNewChart,
  props<{ chartStorageUnitDescription: ChartDescription }>()
);

const updateChart = createAction(
  ChartActions.updateChart,
  props<{ fileDescriptionId: string; newData: JSONString }>()
);

const deleteChart = createAction(
  ChartActions.deleteChart,
  props<{ storageUnitDescriptionId: string }>()
);

export const chartActions = {
  insertNewChartDescription,
  updateChart,
  deleteChart,
};
