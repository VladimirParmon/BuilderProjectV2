import { createAction, props } from '@ngrx/store';
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
  deleteTextTool = '[Tools/Text] Delete a text tool description using its id',
}

const insertNewCollageTool = createAction(
  ToolsActions.insertNewCollageTool,
  props<{
    collageToolDescription: CollageToolDescription;
  }>()
);
const insertNewAudioTool = createAction(
  ToolsActions.insertNewAudioTool,
  props<{ audioToolDescription: AudioToolDescription }>()
);
const insertNewVideoTool = createAction(
  ToolsActions.insertNewVideoTool,
  props<{ videoToolDescription: VideoToolDescription }>()
);
const insertNewSliderTool = createAction(
  ToolsActions.insertNewSliderTool,
  props<{ sliderToolDescription: SliderToolDescription }>()
);
const insertNewPDFTool = createAction(
  ToolsActions.insertNewPDFTool,
  props<{ PDFToolDescription: PDFToolDescription }>()
);
const insertNewTextTool = createAction(
  ToolsActions.insertNewTextTool,
  props<{ textToolDescription: TextToolDescription }>()
);
const deleteTextTool = createAction(
  ToolsActions.deleteTextTool,
  props<{ toolDescriptionId: string }>()
);

export const toolsActions = {
  insertNewCollageTool,
  insertNewAudioTool,
  insertNewVideoTool,
  insertNewSliderTool,
  insertNewPDFTool,
  insertNewTextTool,
  deleteTextTool,
};
