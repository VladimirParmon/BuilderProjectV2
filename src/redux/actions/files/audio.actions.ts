import { createAction, props } from '@ngrx/store';
import { AudioFileDescription } from 'src/constants/models/files';

enum AudioActions {
  insertAudio = '[Files/Audio] Insert new audios to the files storage',
  deleteAudio = '[Files/Audio] Delete an audio description',
  deleteMultipleAudios = '[Files/Audios] Delete multiple audio file descriptions from store',
}

const insertNewAudioFilesDescriptions = createAction(
  AudioActions.insertAudio,
  props<{ filesDescriptions: AudioFileDescription[] }>()
);

const deleteAudio = createAction(AudioActions.deleteAudio, props<{ fileDescriptionId: string }>());

const deleteMultipleAudios = createAction(
  AudioActions.deleteMultipleAudios,
  props<{ fileDescriptionIds: string[] }>()
);

export const audioActions = {
  insertNewAudioFilesDescriptions,
  deleteAudio,
  deleteMultipleAudios,
};
