import { createAction, props } from '@ngrx/store';
import { ChartToolDescription } from 'src/constants/models/tools';

enum ChartActions {
  insertNewChartTool = '[Tools/Chart] Insert a new chart tool description',
  deleteTool = '[Tools/Chart] Delete a chart tool description using its id',
  updateChartToolContents = '[Tool/Chart] Update a chart tool contents (array of Ids)',
}

const insertNewChartTool = createAction(
  ChartActions.insertNewChartTool,
  props<{ toolDescription: ChartToolDescription }>()
);

const deleteChartTool = createAction(
  ChartActions.deleteTool,
  props<{ toolDescriptionId: string }>()
);

const updateChartToolContents = createAction(
  ChartActions.updateChartToolContents,
  props<{ toolDescriptionId: string; newContents: string[] }>()
);

export const chartActions = {
  insertNewChartTool,
  deleteChartTool,
  updateChartToolContents,
};
