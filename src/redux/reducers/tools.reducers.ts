import { createReducer, on } from '@ngrx/store';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { initialState } from 'src/redux/';
import { FileDescriptionId } from 'src/constants/models/files';

export const toolsReducer = createReducer(
  initialState.tools,
  on(
    toolsActions.insertNewCollageTool,
    toolsActions.insertNewAudioTool,
    toolsActions.insertNewPDFTool,
    toolsActions.insertNewSliderTool,
    toolsActions.insertNewVideoTool,
    toolsActions.insertNewTextTool,
    toolsActions.insertNewChartTool,
    (state, { toolDescription }) => {
      return [...state, toolDescription];
    }
  ),

  on(
    toolsActions.deleteTextTool,
    toolsActions.deleteAudioTool,
    toolsActions.deleteVideoTool,
    toolsActions.deleteSliderTool,
    toolsActions.deleteCollageTool,
    toolsActions.deleteChartTool,
    toolsActions.deletePDFTool,
    (state, { toolDescriptionId }) => state.filter((el) => el.id !== toolDescriptionId)
  ),
  on(
    toolsActions.updateTextToolContents,
    toolsActions.updateAudioToolContents,
    toolsActions.updateVideoToolContents,
    toolsActions.updateSliderToolContents,
    toolsActions.updatePDFToolContents,
    toolsActions.updateChartToolContents,
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
    toolsActions.deleteFileFromAudioTool,
    (state, { toolDescriptionId, fileDescriptionId }) =>
      state.map((t) => {
        if (t.id !== toolDescriptionId) return t;
        const oldContents = t.content as FileDescriptionId[];
        const newContents = oldContents.filter((c) => c !== fileDescriptionId);
        return { ...t, content: newContents };
      })
  )
);
