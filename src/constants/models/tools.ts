import { FlexboxFlowOptions, FlexboxPositioningOptions, ToolNames } from '../constants';
import { ChartDescriptionId } from './charts';
import { FileDescriptionId, TextDescription } from './files';

export type ToolDescriptionId = string;
export type TextDescriptionId = string;

export type ToolDescription =
  | CollageToolDescription
  | SliderToolDescription
  | AudioToolDescription
  | VideoToolDescription
  | PDFToolDescription
  | TextToolDescription
  | ChartToolDescription;

interface BasicToolDescription {
  id: ToolDescriptionId;
  type: ToolNames;
  content: ToolDescriptionContent;
}

export type ToolDescriptionContent =
  | FileDescriptionId[]
  | FileDescriptionId
  | TextDescriptionId
  | ChartDescriptionId;

export interface CollageToolDescription extends BasicToolDescription {
  content: FileDescriptionId[];
  currentJustifyContent: FlexboxPositioningOptions;
  currentAlignItems: FlexboxPositioningOptions;
  currentFlow: FlexboxFlowOptions;
}

export interface SliderToolDescription extends BasicToolDescription {
  content: FileDescriptionId[];
}
export interface AudioToolDescription extends BasicToolDescription {
  content: FileDescriptionId[];
}
export interface VideoToolDescription extends BasicToolDescription {
  content: FileDescriptionId;
}
export interface PDFToolDescription extends BasicToolDescription {
  content: FileDescriptionId[];
}
export interface TextToolDescription extends BasicToolDescription {
  content: TextDescriptionId;
}
export interface ChartToolDescription extends BasicToolDescription {
  content: ChartDescriptionId;
}
