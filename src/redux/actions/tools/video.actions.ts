import { createAction, props } from '@ngrx/store';
import { VideoToolDescription } from 'src/constants/models/tools';

export enum VideoActions {
  insertNewVideoTool = '[Tools/Video] Insert a new video tool description',
  deleteVideoTool = '[Tools/Video] Delete a tool description using its id',
  updateVideoToolContents = '[Tool/Collage] Update a video tool contents (id of the file description)',
}

const insertNewVideoTool = createAction(
  VideoActions.insertNewVideoTool,
  props<{ toolDescription: VideoToolDescription }>()
);

const deleteVideoTool = createAction(
  VideoActions.deleteVideoTool,
  props<{ toolDescriptionId: string }>()
);

const updateVideoToolContents = createAction(
  VideoActions.updateVideoToolContents,
  props<{ toolDescriptionId: string; newContents: string[] }>()
);

export const videoActions = {
  insertNewVideoTool,
  deleteVideoTool,
  updateVideoToolContents,
};
