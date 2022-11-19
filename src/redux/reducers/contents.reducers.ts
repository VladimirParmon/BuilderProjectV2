import { createReducer, on } from '@ngrx/store';
import { globalActions } from 'src/redux/actions/global.actions';
import { contentsActions } from 'src/redux/actions/contents.actions';
import { initialState } from 'src/redux/';

export const contentsReducer = createReducer(
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
