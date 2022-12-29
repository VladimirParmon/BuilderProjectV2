import { MediaFileTypes } from 'src/constants/constants';
import { JSONDataStorage } from 'src/constants/models/general';

export const initialState: JSONDataStorage = {
  contents: [],
  files: {
    [MediaFileTypes.TEXT]: [],
    [MediaFileTypes.IMAGES]: [],
    [MediaFileTypes.VIDEOS]: [],
    [MediaFileTypes.PDFs]: [],
    [MediaFileTypes.AUDIOS]: [],
    [MediaFileTypes.CHARTS]: [],
  },
  tools: [],
};
