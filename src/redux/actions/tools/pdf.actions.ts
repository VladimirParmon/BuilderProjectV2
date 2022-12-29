import { createAction, props } from '@ngrx/store';
import { PDFToolDescription } from 'src/constants/models/tools';

enum PDFActions {
  insertNewPDFTool = '[Tools/PDF] Insert a new PDF tool description',
  updatePDFToolContents = '[Tools/PDF] Update PDF tool contents array (ids of file descriptions)',
  addNewContentsToPDF = '[Tools/PDF] Add new PDF ids to array of contents',
  deleteFileFromPDFTool = '[Tools/PDF] Delete a file from PDF tool contents array',
  deletePDFTool = '[Tools/PDF] Delete a PDF tool description using its id',
}

const updatePDFToolContents = createAction(
  PDFActions.updatePDFToolContents,
  props<{ toolDescriptionId: string; newContents: string[] }>()
);

const addNewContentsToPDF = createAction(
  PDFActions.addNewContentsToPDF,
  props<{ toolDescriptionId: string; fileDescriptionIds: string[] }>()
);

const deleteFileFromPDFTool = createAction(
  PDFActions.deleteFileFromPDFTool,
  props<{ toolDescriptionId: string; fileDescriptionId: string }>()
);

const insertNewPDFTool = createAction(
  PDFActions.insertNewPDFTool,
  props<{ toolDescription: PDFToolDescription }>()
);

const deletePDFTool = createAction(
  PDFActions.deletePDFTool,
  props<{ toolDescriptionId: string }>()
);

export const PDFsActions = {
  updatePDFToolContents,
  addNewContentsToPDF,
  deleteFileFromPDFTool,
  insertNewPDFTool,
  deletePDFTool,
};
