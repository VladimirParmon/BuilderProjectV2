import { createAction, props } from '@ngrx/store';
import { FlexboxFlowOptions, FlexboxPositioningOptions } from 'src/constants/constants';
import {
  TextToolDescription,
  CollageToolDescription,
  AudioToolDescription,
  PDFToolDescription,
  SliderToolDescription,
  VideoToolDescription,
} from 'src/constants/models';

enum ToolsActions {
  insertNewCollageTool = '[Tools/Collage] Insert a new collage tool description',
  insertNewSliderTool = '[Tools/Slider] Insert a new slider tool description',
  insertNewAudioTool = '[Tools/Audio] Insert a new audio tool description',
  insertNewVideoTool = '[Tools/Video] Insert a new video tool description',
  insertNewPDFTool = '[Tools/PDF] Insert a new PDF tool description',
  insertNewTextTool = '[Tools/Text] Insert a new text tool description',
  deleteTool = '[Tools/Text] Delete a tool description using its id',
  updateToolContents = '[Tool/Collage] Update a collage tool contents (ids of file descriptions or text)',
  updateCollageToolLayout = '[Tool/Collage] Update layout settings (justify, align, flow)',
  updatePDFToolContents = '[Tools/PDF] Update PDF tool contents array (ids of file descriptions)',
  addNewContentsToPDF = '[Tools/PDF] Add new PDF ids to array of contents',
  deleteFileFromPDFTool = '[Tools/PDF] Delete a file from PDF tool contents array',
  insertNewImagesInCollage = '[Tools/Collage] Insert new image ids into contents array',
  deleteImagesFromCollage = '[Tools/Collage] Delete image ids from contents array',
}

const insertNewCollageTool = createAction(
  ToolsActions.insertNewCollageTool,
  props<{
    toolDescription: CollageToolDescription;
  }>()
);
const insertNewAudioTool = createAction(
  ToolsActions.insertNewAudioTool,
  props<{ toolDescription: AudioToolDescription }>()
);
const insertNewVideoTool = createAction(
  ToolsActions.insertNewVideoTool,
  props<{ toolDescription: VideoToolDescription }>()
);
const insertNewSliderTool = createAction(
  ToolsActions.insertNewSliderTool,
  props<{ toolDescription: SliderToolDescription }>()
);
const insertNewPDFTool = createAction(
  ToolsActions.insertNewPDFTool,
  props<{ toolDescription: PDFToolDescription }>()
);
const insertNewTextTool = createAction(
  ToolsActions.insertNewTextTool,
  props<{ toolDescription: TextToolDescription }>()
);
const deleteTool = createAction(ToolsActions.deleteTool, props<{ toolDescriptionId: string }>());
const updateToolContents = createAction(
  ToolsActions.updateToolContents,
  props<{ toolDescriptionId: string; newContents: string[] }>()
);
const updateCollageToolLayout = createAction(
  ToolsActions.updateCollageToolLayout,
  props<{
    collageToolId: string;
    newJustifyContent: FlexboxPositioningOptions;
    newAlignItems: FlexboxPositioningOptions;
    newFlow: FlexboxFlowOptions;
  }>()
);
const updatePDFToolContents = createAction(
  ToolsActions.updatePDFToolContents,
  props<{ toolDescriptionId: string; newContents: string[] }>()
);
const addNewContentsToPDF = createAction(
  ToolsActions.addNewContentsToPDF,
  props<{ toolDescriptionId: string; fileDescriptionIds: string[] }>()
);
const deleteFileFromPDFTool = createAction(
  ToolsActions.deleteFileFromPDFTool,
  props<{ toolDescriptionId: string; fileDescriptionId: string }>()
);
const insertNewImagesInCollage = createAction(
  ToolsActions.insertNewImagesInCollage,
  props<{ toolDescriptionId: string; fileDescriptionIds: string[] }>()
);
const deleteImageFromCollage = createAction(
  ToolsActions.deleteImagesFromCollage,
  props<{ toolDescriptionId: string; fileDescriptionId: string }>()
);

export const toolsActions = {
  insertNewCollageTool,
  insertNewAudioTool,
  insertNewVideoTool,
  insertNewSliderTool,
  insertNewPDFTool,
  insertNewTextTool,
  deleteTool,
  updateToolContents,
  updateCollageToolLayout,
  updatePDFToolContents,
  addNewContentsToPDF,
  deleteFileFromPDFTool,
  insertNewImagesInCollage,
  deleteImageFromCollage,
};
