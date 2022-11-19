type PageId = string;
export type ToolDescriptionId = string;
type FileDescriptionId = string;
export type TextDescriptionId = string;

export interface JSONDataStorage {
  contents: SinglePageInfo[];
  files: MultimediaFilesCategories;
  tools: ToolDescription[];
}

export type ToolDescription =
  | CollageToolDescription
  | SliderToolDescription
  | AudioToolDescription
  | VideoToolDescription
  | PDFToolDescription
  | TextToolDescription;

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

export type MultimediaFilesCategories = {
  [MediaFileTypes.TEXT]: TextDescription[];
  [MediaFileTypes.IMAGES]: ImageFileDescription[];
  [MediaFileTypes.VIDEOS]: VideoFileDescription[];
  [MediaFileTypes.PDFs]: PDFFileDescription[];
  [MediaFileTypes.AUDIOS]: AudioFileDescription[];
};

export interface TextDescription {
  id: TextDescriptionId;
  text: string;
}

export interface BasicFileDescription {
  id: FileDescriptionId;
  pathToFile: string;
  title?: string;
}

export type VideoFileDescription = BasicFileDescription;
export type PDFFileDescription = BasicFileDescription;
export type AudioFileDescription = BasicFileDescription;

export interface ImageFileDescription extends BasicFileDescription {
  width: number;
}

interface BasicToolDescription {
  id: ToolDescriptionId;
  type: ToolNames;
  content: ToolDescriptionContent;
}

export type ToolDescriptionContent =
  | FileDescriptionId[]
  | FileDescriptionId
  | TextDescription;

export interface CollageToolDescription extends BasicToolDescription {
  currentJustifyContent: FlexboxPositioningOptions;
  currentAlignItems: FlexboxPositioningOptions;
  currentFlow: FlexboxFlowOptions;
}

type SliderToolDescription = BasicToolDescription;
type AudioToolDescription = BasicToolDescription;
type VideoToolDescription = BasicToolDescription;
type PDFToolDescription = BasicToolDescription;
export type TextToolDescription = BasicToolDescription;

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
  DELETE_TOOL = 'tekst dlya tula',
}

export interface ToolbarToolListOption {
  name: ToolNames;
  icon: string;
}

export enum inputTypes {
  IMAGES = '.png, .jpg, .jpeg, .gif',
  VIDEO = '.mp4, .webm, .avi, .3gp',
  AUDIO = '.mp3, .wav, .flac',
  PDF = '.pdf',
}

export interface imageDescription {
  index: number;
  src: string;
  width: number;
}
