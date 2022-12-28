import { createAction, props } from '@ngrx/store';
import { TextDescription } from 'src/constants/models';

enum TextActions {
  updateText = '[Files/Text] Update the description of a text unit',
  insertText = '[Files/Text] Insert a new text unit',
  deleteText = '[Files/Text] Delete a text storage unit',
}

const updateTextStorageUnit = createAction(
  TextActions.updateText,
  props<{ id: string; newText: string }>()
);

const insertNewTextStorageUnit = createAction(
  TextActions.insertText,
  props<{ textDescription: TextDescription }>()
);

const deleteTextStorageUnit = createAction(
  TextActions.deleteText,
  props<{ storageUnitDescriptionId: string }>()
);

export const textActions = {
  updateTextStorageUnit,
  insertNewTextStorageUnit,
  deleteTextStorageUnit,
};
