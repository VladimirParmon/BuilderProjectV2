import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  TextToolDescription,
  TextDescription,
  TextDescriptionId,
  ToolDescriptionId,
  FileDescriptionId,
  ImageFileDescription,
  CollageToolDescription,
} from 'src/constants/models';
import { contentsActions, filesActions, toolsActions } from 'src/redux/actions';
import { v4 as uuidv4 } from 'uuid';
import { ToolNames } from 'src/constants/constants';
import { Defaults } from './defaults';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  constructor(private store: Store) {}

  createNewTextTool(pageId: string) {
    const textDescriptionId: TextDescriptionId = uuidv4();
    const textToolDescriptionId: ToolDescriptionId = uuidv4();

    const textDescription: TextDescription = {
      id: textDescriptionId,
      text: '',
    };
    const toolDescription: TextToolDescription = {
      id: textToolDescriptionId,
      type: ToolNames.TEXT,
      content: textDescriptionId,
    };

    this.store.dispatch(filesActions.insertNewTextStorageUnit({ textDescription }));
    this.store.dispatch(toolsActions.insertNewTextTool({ toolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: textToolDescriptionId }));
  }

  createNewAudioTool(pageId: string, fileNames: string[]) {}
  createNewVideoTool(pageId: string, fileName: string) {}
  createNewPDFTool(pageId: string, fileNames: string[]) {}
  createNewCollageTool(pageId: string, fileNames: string[]) {
    const collageToolDescriptionId = uuidv4();
    const filesDescriptions: ImageFileDescription[] = fileNames.map((name) => ({
      id: uuidv4(),
      pathToFile: name,
      width: Defaults.defaultImageWidth,
    }));
    const fileDescriptionIds: FileDescriptionId[] = filesDescriptions.map((d) => d.id);

    const collageToolDescription: CollageToolDescription = {
      id: collageToolDescriptionId,
      type: ToolNames.COLLAGE,
      content: fileDescriptionIds,
      currentJustifyContent: Defaults.justifyContent,
      currentAlignItems: Defaults.alignItems,
      currentFlow: Defaults.flow,
    };
    this.store.dispatch(filesActions.insertNewImageFileDescriptions({ filesDescriptions }));
    this.store.dispatch(toolsActions.insertNewCollageTool({ collageToolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: collageToolDescriptionId }));
  }
  createNewSliderTool(pageId: string, fileNames: string[]) {}
}
