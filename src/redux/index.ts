import { MediaFileTypes } from 'src/constants/constants';
import { JSONDataStorage } from 'src/constants/models';

export const initialState: JSONDataStorage = {
  contents: [],
  files: {
    [MediaFileTypes.TEXT]: [],
    [MediaFileTypes.IMAGES]: [],
    [MediaFileTypes.VIDEOS]: [],
    [MediaFileTypes.PDFs]: [],
    [MediaFileTypes.AUDIOS]: [],
  },
  tools: [],
};
