import { createAction, props } from '@ngrx/store';
import { SinglePageInfo } from 'src/constants/models';

enum ContentsActions {
  addNewPage = '[Contents/Page] Add a new empty page',
  deletePage = '[Contents/Page] Delete a page',
  updatePageName = '[Contents/Page] Update the name of a page using its id',
  updatePageChildren = '[Contents/Children pages] Update the array of children pages ids',
  updateTools = '[Contents/Tools] Update the array of tools that a page displays',
  changePageParent = '[Contents/Page] Change parentId of a page',
  removeChildPage = '[Contents/Page] Remove a child from the children pages array',
  addChildPage = '[Contents/Page] Add a child to the children pages array',
  updateWholeSlice = '[Contents/Whole] Update the whole contents array',
  deleteTool = '[Contents/Tools] Delete a tool id from array of page tool ids',
  addTool = '[Contents/Tools] Add a new tool id to array of tool ids',
}

const updatePageName = createAction(
  ContentsActions.updatePageName,
  props<{ pageId: string; newName: string }>()
);
const updatePageChildren = createAction(
  ContentsActions.updatePageChildren,
  props<{ pageId: string; newChildrenIds: string[] }>()
);
const updateTools = createAction(
  ContentsActions.updateTools,
  props<{ pageId: string; newToolsIds: string[] }>()
);
const changePageParent = createAction(
  ContentsActions.changePageParent,
  props<{ targetPageId: string; newParentId: string }>()
);
const removeChildPage = createAction(
  ContentsActions.removeChildPage,
  props<{ targetPageId: string; pageToRemoveId: string }>()
);
const addChildPage = createAction(
  ContentsActions.addChildPage,
  props<{ targetPageId: string; pageToAddId: string }>()
);
const updateWholeSlice = createAction(
  ContentsActions.updateWholeSlice,
  props<{ newArray: SinglePageInfo[] }>()
);
const deleteTool = createAction(
  ContentsActions.deleteTool,
  props<{ pageId: string; toolDescriptionId: string }>()
);
const addTool = createAction(ContentsActions.addTool, props<{ pageId: string; toolId: string }>());
const addNewPage = createAction(ContentsActions.addNewPage, props<{ pageInfo: SinglePageInfo }>());
const deletePage = createAction(ContentsActions.deletePage, props<{ pageId: string }>());

export const contentsActions = {
  updatePageName,
  updatePageChildren,
  updateTools,
  changePageParent,
  removeChildPage,
  addChildPage,
  updateWholeSlice,
  deleteTool,
  addTool,
  addNewPage,
  deletePage,
};
