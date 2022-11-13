import { createAction, props } from '@ngrx/store';
import {
  FlexboxFlowOptions,
  FlexboxPositioningOptions,
  JSONDataStorage,
  Tools,
} from '../constants/models';

enum APIActions {
  retrieveFromJSONSuccess = '[Server call/Load project] Save retrieved from the local JSON file data',
}

enum ContentsActions {
  updatePageName = '[Contents/Page] Update the name of a page using its id',
  updatePageChildren = '[Contents/Children pages] Update the array of children pages ids',
  updateTools = '[Contents/Tools] Update the array of tools that a page displays',
  changePageParent = '[Contents/Page] Change parentId of a page',
  removeChildPage = '[Contents/Page] Remove a child from the children pages array',
  addChildPage = '[Contents/Page] Add a child to the children pages array',
  updateWholeChildrenArray = '[Contents/Page] Insert newly formed array as a part of DND operation',
}

enum FileActions {
  updateText = '[Files/Text] Update the description of a text storage unit',
  insertText = '[Files/Text] Insert a new text storage unit',
  insertImage = '[Files/Image] Insert a new image storage unit',
  insertVideo = '[Files/Video] Insert a new video storage unit',
  insertPDF = '[Files/PDF] Insert a new PDF storage unit',
  insertAudio = '[Files/Audio] Insert a new audio storage unit',
}

enum JunctionsActions {
  insertNewCollageTool = '[Junctions/Collage] Insert a new collage tool description',
  insertNewSliderTool = '[Junctions/Slider] Insert a new slider tool description',
  insertNewAudioTool = '[Junctions/Audio] Insert a new audio tool description',
  insertNewVideoTool = '[Junctions/Video] Insert a new video tool description',
  insertNewPDFTool = '[Junctions/PDF] Insert a new PDF tool description',
  insertNewTextTool = '[Junctions/Text] Insert a new text tool description',
}

//Global
const saveRetrievedData = createAction(
  APIActions.retrieveFromJSONSuccess,
  props<{ data: JSONDataStorage }>()
);

//Contents
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
const updateWholeChildrenArray = createAction(
  ContentsActions.updateWholeChildrenArray,
  props<{ targetPageId: string; newArray: string[] }>()
);

//Files
const updateTextStorageUnit = createAction(
  FileActions.updateText,
  props<{ id: string; newText: string }>()
);
const insertNewTextStorageUnit = createAction(FileActions.insertText);
const insertNewImageStorageUnit = createAction(
  FileActions.insertImage,
  props<{ path: string; title?: string; width?: number }>()
);
const insertNewVideoStorageUnit = createAction(
  FileActions.insertVideo,
  props<{ path: string; title?: string }>()
);
const insertNewPDFStorageUnit = createAction(
  FileActions.insertPDF,
  props<{ path: string; title?: string }>()
);
const insertNewAudioStorageUnit = createAction(
  FileActions.insertAudio,
  props<{ path: string; title?: string }>()
);

//Junctions
const insertNewCollageTool = createAction(
  JunctionsActions.insertNewCollageTool,
  props<{
    files: string[];
    justify?: FlexboxPositioningOptions;
    align?: FlexboxPositioningOptions;
    flow?: FlexboxFlowOptions;
  }>()
);
const insertNewAudioTool = createAction(
  JunctionsActions.insertNewAudioTool,
  props<{ files: string[] }>()
);
const insertNewVideoTool = createAction(
  JunctionsActions.insertNewVideoTool,
  props<{ files: string[] }>()
);
const insertNewSliderTool = createAction(
  JunctionsActions.insertNewSliderTool,
  props<{ files: string[] }>()
);
const insertNewPDFTool = createAction(
  JunctionsActions.insertNewPDFTool,
  props<{ files: string[] }>()
);
const insertNewTextTool = createAction(
  JunctionsActions.insertNewTextTool,
  props<{ files: string[] }>()
);

export const globalActions = {
  saveRetrievedData,
};

export const contentsActions = {
  updatePageName,
  updatePageChildren,
  updateTools,
  changePageParent,
  removeChildPage,
  addChildPage,
  updateWholeChildrenArray,
};

export const filesActions = {
  updateTextStorageUnit,
  insertNewTextStorageUnit,
  insertNewImageStorageUnit,
  insertNewVideoStorageUnit,
  insertNewPDFStorageUnit,
  insertNewAudioStorageUnit,
};

export const junctionsActions = {
  insertNewCollageTool,
  insertNewAudioTool,
  insertNewVideoTool,
  insertNewSliderTool,
  insertNewPDFTool,
  insertNewTextTool,
};
