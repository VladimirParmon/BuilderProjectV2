import { createAction, props } from '@ngrx/store';
import { VideoFileDescription } from 'src/constants/models';

enum VideoActions {
  insertVideo = '[Files/Video] Insert a new video to the files storage',
  deleteVideo = '[Files/Video] Delete a video description',
}

const insertNewVideoFileDescription = createAction(
  VideoActions.insertVideo,
  props<{ fileDescription: VideoFileDescription }>()
);

const deleteVideo = createAction(
  VideoActions.deleteVideo,
  props<{ storageUnitDescriptionId: string }>()
);

export const videoActions = {
  insertNewVideoFileDescription,
  deleteVideo,
};
