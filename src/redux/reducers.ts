import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import {
  globalActions,
  filesActions,
  contentsActions,
  junctionsActions,
} from './actions';
import {
  JSONDataStorage,
  MediaFileTypes,
  ToolNames,
} from '../constants/models';
import { v4 as uuidv4 } from 'uuid';
import { Defaults } from 'src/app/services/defaults';

export const initialState: JSONDataStorage = {
  contentsList: [],
  files: {
    [MediaFileTypes.TEXT]: [],
    [MediaFileTypes.IMAGES]: [],
    [MediaFileTypes.VIDEOS]: [],
    [MediaFileTypes.PDFs]: [],
    [MediaFileTypes.AUDIOS]: [],
  },
  junctions: [],
};

const contentsReducer = createReducer(
  initialState.contentsList,
  on(globalActions.saveRetrievedData, (state, { data }) => data.contentsList),
  on(contentsActions.updatePageName, (state, { pageId, newName }) =>
    state.map((el) => (el.id === pageId ? { ...el, name: newName } : el))
  ),
  on(contentsActions.updatePageChildren, (state, { pageId, newChildrenIds }) =>
    state.map((el) =>
      el.id === pageId ? { ...el, childPages: newChildrenIds } : el
    )
  ),
  on(contentsActions.updateTools, (state, { pageId, newToolsIds }) =>
    state.map((el) => (el.id === pageId ? { ...el, tools: newToolsIds } : el))
  ),
  on(
    contentsActions.updateWholeChildrenArray,
    (state, { targetPageId, newArray }) =>
      state.map((el) =>
        el.id === targetPageId ? { ...el, childPages: newArray } : el
      )
  ),
  on(contentsActions.changePageParent, (state, { targetPageId, newParentId }) =>
    state.map((el) =>
      el.id === targetPageId ? { ...el, parentId: newParentId } : el
    )
  ),
  on(
    contentsActions.removeChildPage,
    (state, { targetPageId, pageToRemoveId }) =>
      state.map((el) =>
        el.id === targetPageId
          ? {
              ...el,
              childPages: el.childPages.filter((p) => p !== pageToRemoveId),
            }
          : el
      )
  ),
  on(contentsActions.updateWholeSlice, (state, { newArray }) => newArray)
);

export const filesReducer = createReducer(
  initialState.files,
  on(globalActions.saveRetrievedData, (state, { data }) => data.files),
  on(filesActions.insertNewTextStorageUnit, (state) => {
    const newTextUnit = {
      id: uuidv4(),
      text: '',
    };
    return {
      ...state,
      text: [...state.text, { ...newTextUnit }],
    };
  }),
  on(filesActions.updateTextStorageUnit, (state, { id, newText }) => ({
    ...state,
    text: state.text.map((el) =>
      el.id === id ? { ...el, text: newText } : el
    ),
  })),
  on(
    filesActions.insertNewImageStorageUnit,
    (state, { path, title, width }) => {
      const newImageUnit = {
        id: uuidv4(),
        pathToFile: path,
        title: title,
        width: width || Defaults.defaultImageWidth,
      };
      return {
        ...state,
        images: [...state.images, { ...newImageUnit }],
      };
    }
  ),
  on(filesActions.insertNewVideoStorageUnit, (state, { path, title }) => {
    const newVideoUnit = {
      id: uuidv4(),
      pathToFile: path,
      title: title,
    };
    return {
      ...state,
      videos: [...state.videos, { ...newVideoUnit }],
    };
  }),
  on(filesActions.insertNewPDFStorageUnit, (state, { path, title }) => {
    const newPDFUnit = {
      id: uuidv4(),
      pathToFile: path,
      title: title,
    };
    return {
      ...state,
      PDFs: [...state.PDFs, { ...newPDFUnit }],
    };
  }),
  on(filesActions.insertNewAudioStorageUnit, (state, { path, title }) => {
    const newAudioUnit = {
      id: uuidv4(),
      pathToFile: path,
      title: title,
    };
    return {
      ...state,
      audios: [...state.audios, { ...newAudioUnit }],
    };
  })
);

const junctionsReducer = createReducer(
  initialState.junctions,
  on(globalActions.saveRetrievedData, (state, { data }) => data.junctions),
  on(
    junctionsActions.insertNewCollageTool,
    (state, { files, justify, align, flow }) => {
      const newCollageTool = {
        id: uuidv4(),
        type: ToolNames.COLLAGE,
        content: files,
        currentJustifyContent: justify || Defaults.justifyContent,
        currentAlignItems: align || Defaults.alignItems,
        currentFlow: flow || Defaults.flow,
      };
      return [...state, { ...newCollageTool }];
    }
  ),
  on(junctionsActions.insertNewAudioTool, (state, { files }) => {
    const newAudioTool = {
      id: uuidv4(),
      type: ToolNames.AUDIO,
      content: files,
    };
    return [...state, { ...newAudioTool }];
  }),
  on(junctionsActions.insertNewSliderTool, (state, { files }) => {
    const newSliderTool = {
      id: uuidv4(),
      type: ToolNames.SLIDER,
      content: files,
    };
    return [...state, { ...newSliderTool }];
  }),
  on(junctionsActions.insertNewVideoTool, (state, { files }) => {
    const newVideoTool = {
      id: uuidv4(),
      type: ToolNames.VIDEO,
      content: files,
    };
    return [...state, { ...newVideoTool }];
  }),
  on(junctionsActions.insertNewTextTool, (state, { files }) => {
    const newTextTool = {
      id: uuidv4(),
      type: ToolNames.TEXT,
      content: files,
    };
    return [...state, { ...newTextTool }];
  }),
  on(junctionsActions.insertNewPDFTool, (state, { files }) => {
    const newPDFTool = {
      id: uuidv4(),
      type: ToolNames.PDF,
      content: files,
    };
    return [...state, { ...newPDFTool }];
  })
);

export const reducers: ActionReducerMap<JSONDataStorage> = {
  contentsList: contentsReducer,
  files: filesReducer,
  junctions: junctionsReducer,
};
