import { createAction, props } from '@ngrx/store';
import { AudioToolDescription } from 'src/constants/models/tools';

enum AudioActions {
  insertNewAudioTool = '[Tools/Audio] Insert a new audio tool description',
  deleteFileFromAudioTool = '[Tools/Audio] Delete audio id from contents array',
  updateAudioToolContents = '[Tools/Audio] Update audio tool contents array',
  deleteAudioTool = '[Tools/Audio] Delete an audio tool description using its id',
}

const insertNewAudioTool = createAction(
  AudioActions.insertNewAudioTool,
  props<{ toolDescription: AudioToolDescription }>()
);

const deleteFileFromAudioTool = createAction(
  AudioActions.deleteFileFromAudioTool,
  props<{ toolDescriptionId: string; fileDescriptionId: string }>()
);

const updateAudioToolContents = createAction(
  AudioActions.updateAudioToolContents,
  props<{ toolDescriptionId: string; newContents: string[] }>()
);

const deleteAudioTool = createAction(
  AudioActions.deleteAudioTool,
  props<{ toolDescriptionId: string }>()
);

export const audioActions = {
  insertNewAudioTool,
  deleteFileFromAudioTool,
  updateAudioToolContents,
  deleteAudioTool,
};
