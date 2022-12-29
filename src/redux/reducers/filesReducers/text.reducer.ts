import { createReducer, on } from '@ngrx/store';
import { filesActions } from 'src/redux/actions/files.actions';
import { initialState } from 'src/redux/';

export const textReducer = createReducer(
  initialState.files.text,
  on(filesActions.insertNewTextStorageUnit, (state, { textDescription }) => {
    return [...state, textDescription];
  }),
  on(filesActions.updateTextStorageUnit, (state, { id, newText }) =>
    state.map((el) => (el.id === id ? { ...el, text: newText } : el))
  ),
  on(filesActions.deleteTextStorageUnit, (state, { storageUnitDescriptionId }) =>
    state.filter((u) => u.id !== storageUnitDescriptionId)
  )
);
