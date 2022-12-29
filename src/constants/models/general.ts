import { ToolNames } from '../constants';
import { SinglePageInfo } from './contents';
import { MultimediaFilesCategories } from './files';
import { ToolDescription } from './tools';

export interface JSONDataStorage {
  contents: SinglePageInfo[];
  files: MultimediaFilesCategories;
  tools: ToolDescription[];
}

export interface ToolbarToolListOption {
  name: ToolNames;
  icon: string;
}
