import { ToolbarToolListOption } from './models';

export enum inputTypes {
  IMAGES = '.png, .jpg, .jpeg, .gif',
  VIDEO = '.mp4, .webm, .avi, .3gp',
  AUDIO = '.mp3, .wav, .flac',
  PDF = '.pdf',
}

export enum ModalWindowsText {
  CREATE_NEW_PAGE = 'Пожалуйста, введите имя новой страницы',
  DELETE_PAGE = 'Удалить страницу',
  GENERATE_SITE = 'Пожалуйста, дайте проекту имя',
  DELETE_TOOL = 'tekst dlya tula',
}

export enum ActionCases {
  BEFORE = 'before',
  AFTER = 'after',
  INSIDE = 'inside',
  PARENTLESS = 'parentless',
  OUT_OF_BOUNDS = 'outOfBounds',
}

export enum FlexboxPositioningOptions {
  START = 'flex-start',
  CENTER = 'center',
  END = 'flex-end',
  BETWEEN = 'space-between',
  EVENLY = 'space-evenly',
}

export enum FlexboxFlowOptions {
  ROW = 'row',
  COLUMN = 'column',
}

export enum ToolNames {
  TEXT = 'text',
  AUDIO = 'audio',
  VIDEO = 'video',
  PDF = 'PDF',
  SLIDER = 'slider',
  COLLAGE = 'collage',
}

export enum MediaFileTypes {
  TEXT = 'text',
  IMAGES = 'images',
  VIDEOS = 'videos',
  PDFs = 'PDFs',
  AUDIOS = 'audios',
}

export enum ExpandButtonInnerText {
  OPEN = 'Свернуть',
  CLOSE = 'Развернуть',
}

export const toolsList: ToolbarToolListOption[] = [
  {
    name: ToolNames.TEXT,
    icon: 'border_color',
  },
  {
    name: ToolNames.COLLAGE,
    icon: 'photo_library',
  },
  {
    name: ToolNames.PDF,
    icon: 'picture_as_pdf',
  },
  {
    name: ToolNames.VIDEO,
    icon: 'video_library',
  },
  {
    name: ToolNames.AUDIO,
    icon: 'library_music',
  },

  {
    name: ToolNames.SLIDER,
    icon: 'auto_awesome_motion',
  },
  // {
  //   name: ToolNames.PRESENTATION,
  //   icon: 'picture_in_picture',
  // },
];
