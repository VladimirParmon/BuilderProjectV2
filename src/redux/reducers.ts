import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { globalActions, filesActions, contentsActions, toolsActions } from './actions';
import { JSONDataStorage } from '../constants/models';
import { MediaFileTypes, ToolNames } from '../constants/constants';

export const initialState: JSONDataStorage = {
  contents: [],
  files: {
    [MediaFileTypes.TEXT]: [],
    [MediaFileTypes.IMAGES]: [],
    [MediaFileTypes.VIDEOS]: [],
    [MediaFileTypes.PDFs]: [],
    [MediaFileTypes.AUDIOS]: [],
  },
  tools: [],
};

const contentsReducer = createReducer(
  initialState.contents,
  on(globalActions.saveRetrievedData, (state, { data }) => data.contents),
  on(contentsActions.updatePageName, (state, { pageId, newName }) =>
    state.map((el) => (el.id === pageId ? { ...el, name: newName } : el))
  ),
  on(contentsActions.updatePageChildren, (state, { pageId, newChildrenIds }) =>
    state.map((el) => (el.id === pageId ? { ...el, childPages: newChildrenIds } : el))
  ),
  on(contentsActions.updateTools, (state, { pageId, newToolsIds }) =>
    state.map((el) => (el.id === pageId ? { ...el, tools: newToolsIds } : el))
  ),
  on(contentsActions.updateWholeChildrenArray, (state, { targetPageId, newArray }) =>
    state.map((el) => (el.id === targetPageId ? { ...el, childPages: newArray } : el))
  ),
  on(contentsActions.changePageParent, (state, { targetPageId, newParentId }) =>
    state.map((el) => (el.id === targetPageId ? { ...el, parentId: newParentId } : el))
  ),
  on(contentsActions.removeChildPage, (state, { targetPageId, pageToRemoveId }) =>
    state.map((el) =>
      el.id === targetPageId
        ? {
            ...el,
            childPages: el.childPages.filter((p) => p !== pageToRemoveId),
          }
        : el
    )
  ),
  on(contentsActions.updateWholeSlice, (state, { newArray }) => newArray),
  on(contentsActions.deleteTool, (state, { pageId, toolDescriptionId }) => {
    return state.map((el) => {
      if (el.id === pageId) {
        return {
          ...el,
          tools: el.tools.filter((t) => t !== toolDescriptionId),
        };
      } else {
        return el;
      }
    });
  }),
  on(contentsActions.addTool, (state, { pageId, toolId }) =>
    state.map((p) => {
      if (p.id === pageId) {
        return { ...p, tools: [...p.tools, toolId] };
      } else {
        return p;
      }
    })
  )
);

export const filesReducer = createReducer(
  initialState.files,
  on(globalActions.saveRetrievedData, (state, { data }) => data.files),
  on(filesActions.insertNewTextStorageUnit, (state, { textDescription }) => {
    return {
      ...state,
      text: [...state.text, textDescription],
    };
  }),
  on(filesActions.updateTextStorageUnit, (state, { id, newText }) => ({
    ...state,
    text: state.text.map((el) => (el.id === id ? { ...el, text: newText } : el)),
  })),
  on(filesActions.insertNewImageFilesDescriptions, (state, { filesDescriptions }) => {
    return {
      ...state,
      images: [...state.images, ...filesDescriptions],
    };
  }),
  on(filesActions.insertNewAudioFilesDescriptions, (state, { filesDescriptions }) => {
    return {
      ...state,
      audios: [...state.images, ...filesDescriptions],
    };
  }),
  on(filesActions.deleteTextStorageUnit, (state, { id }) => ({
    ...state,
    text: state.text.filter((u) => u.id !== id),
  }))
);

const toolsReducer = createReducer(
  initialState.tools,
  on(globalActions.saveRetrievedData, (state, { data }) => data.tools),
  on(toolsActions.insertNewCollageTool, (state, { collageToolDescription }) => {
    return [...state, collageToolDescription];
  }),
  on(toolsActions.insertNewAudioTool, (state, { audioToolDescription }) => {
    return [...state, audioToolDescription];
  }),
  on(toolsActions.insertNewSliderTool, (state, { files }) => {
    const newSliderTool = {
      id: '',
      type: ToolNames.SLIDER,
      content: files,
    };
    return [...state, { ...newSliderTool }];
  }),
  on(toolsActions.insertNewVideoTool, (state, { files }) => {
    const newVideoTool = {
      id: '',
      type: ToolNames.VIDEO,
      content: files,
    };
    return [...state, { ...newVideoTool }];
  }),
  on(toolsActions.insertNewTextTool, (state, { toolDescription }) => {
    return [...state, toolDescription];
  }),
  on(toolsActions.insertNewPDFTool, (state, { files }) => {
    const newPDFTool = {
      id: '',
      type: ToolNames.PDF,
      content: files,
    };
    return [...state, { ...newPDFTool }];
  }),
  on(toolsActions.deleteTextTool, (state, { toolDescriptionId }) =>
    state.filter((el) => el.id !== toolDescriptionId)
  )
);

export const reducers: ActionReducerMap<JSONDataStorage> = {
  contents: contentsReducer,
  files: filesReducer,
  tools: toolsReducer,
};
