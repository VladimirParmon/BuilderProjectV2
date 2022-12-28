import { createAction, props } from '@ngrx/store';

import { audioActions } from './tools/audio.actions';
import { chartActions } from './tools/chart.actions';
import { collageActions } from './tools/collage.actions';
import { PDFsActions } from './tools/pdf.actions';
import { sliderActions } from './tools/slider.actions';
import { textActions } from './tools/text.tools';
import { videoActions } from './tools/video.actions';

export const toolsActions = {
  ...textActions,
  ...collageActions,
  ...sliderActions,
  ...audioActions,
  ...videoActions,
  ...PDFsActions,
  ...chartActions,
};
