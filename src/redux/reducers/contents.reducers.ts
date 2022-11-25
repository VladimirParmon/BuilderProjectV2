import { createReducer, on } from '@ngrx/store';
import { contentsActions } from 'src/redux/actions/contents.actions';
import { initialState } from 'src/redux/';

export const contentsReducer = createReducer(
  initialState.contents,
  on(contentsActions.updateWholeSlice, (_, { newArray }) => newArray),
  on(contentsActions.addNewPage, (state, { pageInfo }) => [...state, pageInfo]),
  on(contentsActions.deletePage, (state, { pageId }) => state.filter((p) => p.id !== pageId)),
  on(contentsActions.updatePageName, (state, { pageId, newName }) =>
    state.map((el) => (el.id === pageId ? { ...el, name: newName } : el))
  ),
  on(contentsActions.updatePageChildren, (state, { pageId, newChildrenIds }) =>
    state.map((el) => (el.id === pageId ? { ...el, childPages: newChildrenIds } : el))
  ),
  on(contentsActions.updateTools, (state, { pageId, newToolsIds }) =>
    state.map((el) => (el.id === pageId ? { ...el, tools: newToolsIds } : el))
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
  on(contentsActions.deleteTool, (state, { pageId, toolDescriptionId }) =>
    state.map((p) =>
      p.id === pageId
        ? {
            ...p,
            tools: p.tools.filter((t) => t !== toolDescriptionId),
          }
        : p
    )
  ),
  on(contentsActions.addTool, (state, { pageId, toolId }) =>
    state.map((p) => (p.id === pageId ? { ...p, tools: [...p.tools, toolId] } : p))
  )
);
