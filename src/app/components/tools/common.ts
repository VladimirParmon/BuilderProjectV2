import { selectToolDescription } from 'src/redux/selectors/tools.selectors';
import { EMPTY, of, takeUntil } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToolDescription } from 'src/constants/models/tools';
import { ToolDeletionMessages, ToolNames } from 'src/constants/constants';
import { StorageUnitTypes } from 'src/constants/models/files';

export function _fetchToolDescription(this: any) {
  return this.store.select(selectToolDescription(this.toolDescriptionId)).pipe(
    takeUntil(this.destroy$),
    switchMap((fetchedDescription: ToolDescription) => {
      const toolDescriptionValidityCheck = this.descriptionTypeCheck(fetchedDescription);
      const toolContentsValidityCheck = this.contentsTypeCheck(fetchedDescription?.content);
      if (toolDescriptionValidityCheck && toolContentsValidityCheck) {
        return of(fetchedDescription);
      } else {
        if (!toolDescriptionValidityCheck)
          return deleteTool.call(this, ToolDeletionMessages.BROKEN);
        if (!toolContentsValidityCheck) return deleteTool.call(this, ToolDeletionMessages.EMPTY);
        return deleteTool.call(this, ToolDeletionMessages.UNKNOWN);
      }
    })
  );
}

export async function _fetchFiles(this: any, ids: string | string[], type: ToolNames) {
  return this.store.select(this.fileFetcher(ids, type)).pipe(
    takeUntil(this.destroy$),
    switchMap((files: StorageUnitTypes) => {
      if (!files) deleteTool.call(this, ToolDeletionMessages.EMPTY);
      if (this.filesTypeCheck(files)) {
        return of(files);
      } else {
        return deleteTool.call(this, ToolDeletionMessages.BROKEN);
      }
    })
  );
}

function deleteTool(this: any, malfunction: ToolDeletionMessages) {
  this.destroy$.next(true);
  this.deleteTheTool.emit(malfunction);
  return EMPTY;
}
