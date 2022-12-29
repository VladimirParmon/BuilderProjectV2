import { ActionCases, ExpandButtonInnerText } from '../constants';
import { ToolDescriptionId } from './tools';

type PageId = string;

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
