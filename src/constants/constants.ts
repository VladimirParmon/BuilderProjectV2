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
  DELETE_TOOL = 'Вы точно хотите удалить этот блок?',
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
  CHART = 'chart',
}

export enum MediaFileTypes {
  TEXT = 'text',
  IMAGES = 'images',
  VIDEOS = 'videos',
  PDFs = 'PDFs',
  AUDIOS = 'audios',
  CHARTS = 'charts',
}

export enum ChartTypes {
  BAR_VERTICAL = 'bar_vertical',
  PIE = 'pie',
}

export const barVerticalExample = JSON.stringify({
  view: [600, 300],
  colorScheme: {
    domain: ['#d7eaf3', '#77b5d9', '#14397d', '#AAAAAA'],
  },
  gradient: false,
  xAxis: true,
  yAxis: true,
  legend: true,
  showXAxisLabel: false,
  showYAxisLabel: true,
  xAxisLabel: 'My X label',
  yAxisLabel: 'My important Y label data',
  results: [
    {
      name: 'Germany',
      value: 40632,
      extra: {
        code: 'de',
      },
    },
    {
      name: 'United States',
      value: 50000,
      extra: {
        code: 'us',
      },
    },
    {
      name: 'France',
      value: 36745,
      extra: {
        code: 'fr',
      },
    },
  ],
});

export const pieChartExample = JSON.stringify({
  view: [400, 300],
  colorScheme: {
    domain: ['#d7eaf3', '#77b5d9', '#14397d', '#AAAAAA'],
  },
  gradient: false,
  showLegend: true,
  showLabels: true,
  isDoughnut: false,
  legendPosition: 'bottom',
  results: [
    {
      name: 'Germany',
      value: 40632,
      extra: {
        code: 'de',
      },
    },
    {
      name: 'UnitedStates',
      value: 50000,
      extra: {
        code: 'us',
      },
    },
    {
      name: 'France',
      value: 36745,
      extra: {
        code: 'fr',
      },
    },
  ],
});

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
  {
    name: ToolNames.CHART,
    icon: 'area_chart',
  },
  // {
  //   name: ToolNames.PRESENTATION,
  //   icon: 'picture_in_picture',
  // },
];

export const fontFamilies = [
  'Times_New_Roman',
  'Franklin_Gothic_Medium',
  'Arial',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Georgia',
  'Garamond',
  'Courier_New',
  'Brush_Script_MT',
];

export const fontSizes = [
  '8px',
  '9px',
  '10px',
  '12px',
  '14px',
  '16px',
  '20px',
  '24px',
  '32px',
  '42px',
  '54px',
  '68px',
  '84px',
  '98px',
];
