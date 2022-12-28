import { audioActions } from './files/audio.actions';
import { chartActions } from './files/chart.actions';
import { imagesActions } from './files/images.actions';
import { PDFsActions } from './files/pdf.actions';
import { textActions } from './files/text.actions';
import { videoActions } from './files/video.actions';

export const filesActions = {
  ...textActions,
  ...imagesActions,
  ...PDFsActions,
  ...videoActions,
  ...audioActions,
  ...chartActions,
};
