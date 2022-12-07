import { Color, LegendPosition } from '@swimlane/ngx-charts';
import {
  ActionCases,
  ChartTypes,
  ExpandButtonInnerText,
  FlexboxFlowOptions,
  FlexboxPositioningOptions,
  MediaFileTypes,
  ToolNames,
} from './constants';

type PageId = string;
export type ToolDescriptionId = string;
export type FileDescriptionId = string;
export type TextDescriptionId = string;
type ChartDescriptionId = string;
export type JSONString = string;

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
  | TextToolDescription
  | ChartToolDescription;

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

export type MultimediaFilesCategories = {
  [MediaFileTypes.TEXT]: TextDescription[];
  [MediaFileTypes.IMAGES]: ImageFileDescription[];
  [MediaFileTypes.VIDEOS]: VideoFileDescription[];
  [MediaFileTypes.PDFs]: PDFFileDescription[];
  [MediaFileTypes.AUDIOS]: AudioFileDescription[];
  [MediaFileTypes.CHARTS]: ChartDescription[];
};

export type StorageUnitTypes =
  | TextDescription
  | ImageFileDescription
  | VideoFileDescription
  | PDFFileDescription
  | AudioFileDescription
  | ChartDescription;

export interface ChartDescription {
  id: ChartDescriptionId;
  chartType: ChartTypes;
  chartData: JSONString;
}

export interface BarChartData {
  view: [number, number];
  colorScheme: string | Color;
  gradient: boolean;
  xAxis: boolean;
  yAxis: boolean;
  legend: boolean;
  showXAxisLabel: boolean;
  showYAxisLabel: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  results: NonCompoundChartResults[];
}

interface NonCompoundChartResults {
  name: string;
  value: number;
  extra: any;
}

export interface PieChartData {
  view: [number, number];
  colorScheme: string | Color;
  gradient: boolean;
  showLegend: boolean;
  showLabels: boolean;
  isDoughnut: boolean;
  legendPosition: LegendPosition;
  results: NonCompoundChartResults[];
}

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
  | TextDescription
  | ChartDescriptionId;

export interface CollageToolDescription extends BasicToolDescription {
  currentJustifyContent: FlexboxPositioningOptions;
  currentAlignItems: FlexboxPositioningOptions;
  currentFlow: FlexboxFlowOptions;
}

export type SliderToolDescription = BasicToolDescription;
export type AudioToolDescription = BasicToolDescription;
export type VideoToolDescription = BasicToolDescription;
export type PDFToolDescription = BasicToolDescription;
export type TextToolDescription = BasicToolDescription;
export type ChartToolDescription = BasicToolDescription;

export interface Lookup {
  [key: string]: SinglePageInfo;
}

export interface DropInfo {
  targetId: string;
  action: ActionCases;
}

type ExpandKey = 'open' | 'close';
type ExpandButtonInfo = Record<ExpandKey, ExpandButtonInnerText>;

export interface ExpandButtonState {
  expanded: boolean;
  text: ExpandButtonInfo;
}

export interface ToolbarToolListOption {
  name: ToolNames;
  icon: string;
}
