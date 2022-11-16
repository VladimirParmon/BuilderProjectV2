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
  tools: ToolDescriptionId[];
  childPages: PageId[];
  parentId: PageId;
}

export interface RecursiveTreeNode {
  parentNodeId: PageId;
  relatedPageId: PageId;
  relatedPageName: string;
  childNodes: RecursiveTreeNode[];
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
  [MediaFileTypes.TEXT]: TextFieldDescription[];
  [MediaFileTypes.IMAGES]: ImageDescription[];
  [MediaFileTypes.VIDEOS]: FileDescription[];
  [MediaFileTypes.PDFs]: FileDescription[];
  [MediaFileTypes.AUDIOS]: FileDescription[];
};

export interface TextFieldDescription {
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

export interface Lookup {
  [key: string]: SinglePageInfo;
}

export interface DropInfo {
  targetId: string;
  action: ActionCases;
}

export enum ActionCases {
  BEFORE = 'before',
  AFTER = 'after',
  INSIDE = 'inside',
  PARENTLESS = 'parentless',
  OUT_OF_BOUNDS = 'outOfBounds',
}

export enum ExpandButtonInnerText {
  OPEN = 'Свернуть',
  CLOSE = 'Развернуть',
}

type ExpandKey = 'open' | 'close';
type ExpandButtonInfo = Record<ExpandKey, ExpandButtonInnerText>;

export interface ExpandButtonState {
  expanded: boolean;
  text: ExpandButtonInfo;
}

export enum ModalWindowsText {
  CREATE_NEW_PAGE = 'Пожалуйста, введите имя новой страницы',
  DELETE_PAGE = 'Удалить страницу',
  GENERATE_SITE = 'Пожалуйста, дайте проекту имя',
}
