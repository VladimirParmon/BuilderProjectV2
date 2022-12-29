import { createAction, props } from '@ngrx/store';
import { TextToolDescription } from 'src/constants/models/tools';

enum TextActions {
  insertNewTextTool = '[Tools/Text] Insert a new text tool description',
  deleteTextTool = '[Tools/Text] Delete a tool description using its id',
  updateTextToolContents = '[Tool/Text] Update a text tool contents (id of the text storage unit)',
}

const insertNewTextTool = createAction(
  TextActions.insertNewTextTool,
  props<{ toolDescription: TextToolDescription }>()
);

const deleteTextTool = createAction(
  TextActions.deleteTextTool,
  props<{ toolDescriptionId: string }>()
);

const updateTextToolContents = createAction(
  TextActions.updateTextToolContents,
  props<{ toolDescriptionId: string; newContents: string[] }>()
);

export const textActions = {
  insertNewTextTool,
  deleteTextTool,
  updateTextToolContents,
};
