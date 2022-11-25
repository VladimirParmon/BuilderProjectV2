import { createReducer, on } from '@ngrx/store';
import { globalActions } from 'src/redux/actions/global.actions';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { initialState } from 'src/redux/';
import { FileDescriptionId } from 'src/constants/models';

export const toolsReducer = createReducer(
  initialState.tools,
  on(globalActions.saveRetrievedData, (state, { data }) => data.tools),
  on(toolsActions.insertNewCollageTool, (state, { collageToolDescription }) => {
    return [...state, collageToolDescription];
  }),
  on(toolsActions.insertNewAudioTool, (state, { audioToolDescription }) => {
    return [...state, audioToolDescription];
  }),
  on(toolsActions.insertNewPDFTool, (state, { PDFToolDescription }) => {
    return [...state, PDFToolDescription];
  }),
  on(toolsActions.insertNewSliderTool, (state, { sliderToolDescription }) => {
    return [...state, sliderToolDescription];
  }),
  on(toolsActions.insertNewVideoTool, (state, { videoToolDescription }) => {
    return [...state, videoToolDescription];
  }),
  on(toolsActions.insertNewTextTool, (state, { textToolDescription }) => {
    return [...state, textToolDescription];
  }),
  on(toolsActions.deleteTool, (state, { toolDescriptionId }) =>
    state.filter((el) => el.id !== toolDescriptionId)
  ),
  on(
    toolsActions.updateToolContents,
    toolsActions.updatePDFToolContents,
    (state, { toolDescriptionId, newContents }) =>
      state.map((el) => (el.id === toolDescriptionId ? { ...el, content: newContents } : el))
  ),
  on(
    toolsActions.updateCollageToolLayout,
    (state, { collageToolId, newJustifyContent, newAlignItems, newFlow }) =>
      state.map((el) =>
        el.id === collageToolId
          ? {
              ...el,
              currentJustifyContent: newJustifyContent,
              currentAlignItems: newAlignItems,
              currentFlow: newFlow,
            }
          : el
      )
  ),
  on(
    toolsActions.addNewContentsToPDF,
    toolsActions.insertNewImagesInCollage,
    (state, { toolDescriptionId, fileDescriptionIds }) =>
      state.map((t) => {
        if (t.id !== toolDescriptionId) return t;
        const oldContents = t.content as FileDescriptionId[];
        const newContents = [...oldContents, ...fileDescriptionIds];
        return { ...t, content: newContents };
      })
  ),
  on(
    toolsActions.deleteImageFromCollage,
    toolsActions.deleteFileFromPDFTool,
    (state, { toolDescriptionId, fileDescriptionId }) =>
      state.map((t) => {
        if (t.id !== toolDescriptionId) return t;
        const oldContents = t.content as FileDescriptionId[];
        const newContents = oldContents.filter((c) => c !== fileDescriptionId);
        return { ...t, content: newContents };
      })
  )
);
