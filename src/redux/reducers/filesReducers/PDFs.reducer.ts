import { createReducer, on } from '@ngrx/store';
import { filesActions } from 'src/redux/actions/files.actions';
import { initialState } from 'src/redux/';

export const PDFsReducer = createReducer(
  initialState.files.PDFs,
  on(filesActions.insertNewPDFFilesDescriptions, (state, { filesDescriptions }) => [
    ...state,
    ...filesDescriptions,
  ]),
  on(filesActions.deletePDF, (state, { fileDescriptionId }) =>
    state.filter((p) => fileDescriptionId !== p.id)
  ),
  on(filesActions.deleteMultiplePDFs, (state, { fileDescriptionIds }) =>
    state.filter((p) => !fileDescriptionIds.includes(p.id))
  )
);
