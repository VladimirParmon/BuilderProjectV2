import { createReducer, on } from '@ngrx/store';
import { globalActions } from 'src/redux/actions/global.actions';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { initialState } from './index.reducers';

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
  on(toolsActions.deleteTextTool, (state, { toolDescriptionId }) =>
    state.filter((el) => el.id !== toolDescriptionId)
  )
);
