type PageId = string;
type ToolDescriptionId = string;
type FileDescriptionId = string;
type TextFieldId = string;

export interface JSONDataStorage {
  contentsList: SinglePageInfo[];
  files: MultimediaFiles;
  junctions: Junction[];
}

export type Junction = Collage | Slider | Audio | Video | PDF | Text;

export interface SinglePageInfo {
  id: PageId;
  name: string;
  childrenPages: PageId[];
  tools: ToolDescriptionId[];
}

export enum Tools {
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

export type MultimediaFiles = {
  [MediaFileTypes.TEXT]: TextField[];
  [MediaFileTypes.IMAGES]: ImageDescription[];
  [MediaFileTypes.VIDEOS]: FileDescription[];
  [MediaFileTypes.PDFs]: FileDescription[];
  [MediaFileTypes.AUDIOS]: FileDescription[];
};

export interface TextField {
  id: TextFieldId;
  text: string;
}

export interface FileDescription {
  id: FileDescriptionId;
  pathToFile: string;
  title?: string;
}

export interface ImageDescription extends FileDescription {
  width: number;
}

interface ToolDescription {
  id: ToolDescriptionId;
  type: Tools;
  files: FileDescriptionId[] | FileDescriptionId | TextFieldId;
}

export interface Collage extends ToolDescription {
  currentJustifyContent: FlexboxPositioningOptions;
  currentAlignItems: FlexboxPositioningOptions;
  currentFlow: FlexboxFlowOptions;
}

type Slider = ToolDescription;
type Audio = ToolDescription;
type Video = ToolDescription;
type PDF = ToolDescription;
type Text = ToolDescription;

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
