import { createAction, props } from '@ngrx/store';
import { FlexboxFlowOptions, FlexboxPositioningOptions } from 'src/constants/constants';
import { CollageToolDescription } from 'src/constants/models/tools';

enum CollageActions {
  updateCollageToolLayout = '[Tool/Collage] Update layout settings (justify, align, flow)',
  insertNewImagesInCollage = '[Tools/Collage] Insert new image ids into contents array',
  deleteImagesFromCollage = '[Tools/Collage] Delete image ids from contents array',
  insertNewCollageTool = '[Tools/Collage] Insert a new collage tool description',
  deleteCollageTool = '[Tools/Collage] Delete a tool description using its id',
}

const insertNewCollageTool = createAction(
  CollageActions.insertNewCollageTool,
  props<{
    toolDescription: CollageToolDescription;
  }>()
);

const updateCollageToolLayout = createAction(
  CollageActions.updateCollageToolLayout,
  props<{
    collageToolId: string;
    newJustifyContent: FlexboxPositioningOptions;
    newAlignItems: FlexboxPositioningOptions;
    newFlow: FlexboxFlowOptions;
  }>()
);

const insertNewImagesInCollage = createAction(
  CollageActions.insertNewImagesInCollage,
  props<{ toolDescriptionId: string; fileDescriptionIds: string[] }>()
);

const deleteImageFromCollage = createAction(
  CollageActions.deleteImagesFromCollage,
  props<{ toolDescriptionId: string; fileDescriptionId: string }>()
);

const deleteCollageTool = createAction(
  CollageActions.deleteCollageTool,
  props<{ toolDescriptionId: string }>()
);

export const collageActions = {
  insertNewCollageTool,
  updateCollageToolLayout,
  insertNewImagesInCollage,
  deleteImageFromCollage,
  deleteCollageTool,
};
