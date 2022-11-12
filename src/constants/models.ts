type PageId = string;
type ToolDescriptionId = string;
type FileDescriptionId = string;
type TextFieldId = string;

export interface JSONDataStorage {
  contentsList: SinglePageInfo[];
  contentsData: {
    files: MultimediaFiles;
    dataStructures: Junction;
  };
}

type Junction = Collage | Slider | Audio | Video | PDF | Text;

interface SinglePageInfo {
  id: PageId;
  name: string;
  childrenPages: PageId[];
  tools: ToolDescriptionId[];
}

enum Tools {
  TEXT,
  AUDIO,
  VIDEO,
  PDF,
  SLIDER,
  COLLAGE,
}

interface MultimediaFiles {
  textFields: TextField[];
  images: ImageDescription[];
  videos: FileDescription[];
  PDFs: FileDescription[];
  audios: FileDescription[];
}

interface TextField {
  id: TextFieldId;
  text: string;
}

interface FileDescription {
  id: FileDescriptionId;
  pathToFile: string;
  title?: string;
}

interface ImageDescription extends FileDescription {
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
