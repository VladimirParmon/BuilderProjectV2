import { createAction, props } from '@ngrx/store';
import { SliderToolDescription } from 'src/constants/models';

enum SliderActions {
  insertNewSliderTool = '[Tools/Slider] Insert a new slider tool description',
  updateSliderToolContents = '[Tools/Slider] Update the array of image ids in slider tool',
  deleteSliderTool = '[Tools/Slider] Delete a tool description using its id',
}

const insertNewSliderTool = createAction(
  SliderActions.insertNewSliderTool,
  props<{ toolDescription: SliderToolDescription }>()
);

const updateSliderToolContents = createAction(
  SliderActions.updateSliderToolContents,
  props<{ toolDescriptionId: string; newContents: string[] }>()
);

const deleteSliderTool = createAction(
  SliderActions.deleteSliderTool,
  props<{ toolDescriptionId: string }>()
);

export const sliderActions = {
  insertNewSliderTool,
  updateSliderToolContents,
  deleteSliderTool,
};
