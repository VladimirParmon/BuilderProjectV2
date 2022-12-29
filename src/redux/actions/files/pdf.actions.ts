import { createAction, props } from '@ngrx/store';
import { PDFFileDescription } from 'src/constants/models/files';

enum PDFActions {
  insertPDF = '[Files/PDF] Insert new PDFs to the files storage',
  deletePDF = '[Files/PDF] Delete a PDF file description from store',
  deleteMultiplePDFs = '[Files/PDF] Mass delete PDF files (usually, when the related tool is deleted)',
}

const insertNewPDFFilesDescriptions = createAction(
  PDFActions.insertPDF,
  props<{ filesDescriptions: PDFFileDescription[] }>()
);

const deletePDF = createAction(PDFActions.deletePDF, props<{ fileDescriptionId: string }>());

const deleteMultiplePDFs = createAction(
  PDFActions.deleteMultiplePDFs,
  props<{ fileDescriptionIds: string[] }>()
);

export const PDFsActions = {
  insertNewPDFFilesDescriptions,
  deletePDF,
  deleteMultiplePDFs,
};
