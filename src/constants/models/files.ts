import { MediaFileTypes } from '../constants';
import { ChartDescription } from './charts';

export type FileDescriptionId = string;
export type TextDescriptionId = string;

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
