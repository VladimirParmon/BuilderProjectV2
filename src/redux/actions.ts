import { createAction, props } from '@ngrx/store';
import {
  JSONDataStorage,
  SinglePageInfo,
  TextToolDescription,
  TextDescription,
  ImageFileDescription,
  CollageToolDescription,
  AudioFileDescription,
  AudioToolDescription,
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
  updateWholeSlice = '[Contents/Whole] Update the whole contents array',
  deleteTool = '[Contents/Tools] Delete a tool from page tools array',
  addTool = '[Contents/Tools] Add a new tool id to array of tool ids',
}

enum FileActions {
  updateText = '[Files/Text] Update the description of a text storage unit',
  insertText = '[Files/Text] Insert a new text storage unit',
  insertImages = '[Files/Image] Insert new images to the files storage',
  insertVideo = '[Files/Video] Insert a new video storage unit',
  insertPDF = '[Files/PDF] Insert a new PDF storage unit',
  insertAudio = '[Files/Audio] Insert a new audio storage unit',
  deleteText = '[Files/Text] Delete a text storage unit',
}

enum ToolsActions {
  insertNewCollageTool = '[Tools/Collage] Insert a new collage tool description',
  insertNewSliderTool = '[Tools/Slider] Insert a new slider tool description',
  insertNewAudioTool = '[Tools/Audio] Insert a new audio tool description',
  insertNewVideoTool = '[Tools/Video] Insert a new video tool description',
  insertNewPDFTool = '[Tools/PDF] Insert a new PDF tool description',
  insertNewTextTool = '[Tools/Text] Insert a new text tool description',
  deleteTextTool = '[Tools/Text] Delete a text tool using its id',
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
const updateWholeSlice = createAction(
  ContentsActions.updateWholeSlice,
  props<{ newArray: SinglePageInfo[] }>()
);
const deleteTool = createAction(
  ContentsActions.deleteTool,
  props<{ pageId: string; toolDescriptionId: string }>()
);
const addTool = createAction(ContentsActions.addTool, props<{ pageId: string; toolId: string }>());

//Files
const updateTextStorageUnit = createAction(
  FileActions.updateText,
  props<{ id: string; newText: string }>()
);
const insertNewTextStorageUnit = createAction(
  FileActions.insertText,
  props<{ textDescription: TextDescription }>()
);
const insertNewImageFilesDescriptions = createAction(
  FileActions.insertImages,
  props<{ filesDescriptions: ImageFileDescription[] }>()
);
const insertNewVideoStorageUnit = createAction(
  FileActions.insertVideo,
  props<{ path: string; title?: string }>()
);
const insertNewPDFStorageUnit = createAction(
  FileActions.insertPDF,
  props<{ path: string; title?: string }>()
);
const insertNewAudioFilesDescriptions = createAction(
  FileActions.insertAudio,
  props<{ filesDescriptions: AudioFileDescription[] }>()
);

const deleteTextStorageUnit = createAction(FileActions.deleteText, props<{ id: string }>());

//Tools
const insertNewCollageTool = createAction(
  ToolsActions.insertNewCollageTool,
  props<{
    collageToolDescription: CollageToolDescription;
  }>()
);
const insertNewAudioTool = createAction(
  ToolsActions.insertNewAudioTool,
  props<{ audioToolDescription: AudioToolDescription }>()
);
const insertNewVideoTool = createAction(
  ToolsActions.insertNewVideoTool,
  props<{ files: string[] }>()
);
const insertNewSliderTool = createAction(
  ToolsActions.insertNewSliderTool,
  props<{ files: string[] }>()
);
const insertNewPDFTool = createAction(ToolsActions.insertNewPDFTool, props<{ files: string[] }>());
const insertNewTextTool = createAction(
  ToolsActions.insertNewTextTool,
  props<{ toolDescription: TextToolDescription }>()
);
const deleteTextTool = createAction(
  ToolsActions.deleteTextTool,
  props<{ toolDescriptionId: string }>()
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
  updateWholeSlice,
  deleteTool,
  addTool,
};

export const filesActions = {
  updateTextStorageUnit,
  insertNewTextStorageUnit,
  insertNewImageFilesDescriptions,
  insertNewAudioFilesDescriptions,
  deleteTextStorageUnit,
};

export const toolsActions = {
  insertNewCollageTool,
  insertNewAudioTool,
  insertNewVideoTool,
  insertNewSliderTool,
  insertNewPDFTool,
  insertNewTextTool,
  deleteTextTool,
};
