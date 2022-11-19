import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as m from 'src/constants/models';
import { contentsActions } from 'src/redux/actions/contents.actions';
import { filesActions } from 'src/redux/actions/files.actions';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { v4 as uuidv4 } from 'uuid';
import { ToolNames } from 'src/constants/constants';
import { Defaults } from './defaults';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  constructor(private store: Store) {}

  createNewTextTool(pageId: string) {
    const textDescriptionId: m.TextDescriptionId = uuidv4();
    const textToolDescriptionId: m.ToolDescriptionId = uuidv4();

    const textDescription: m.TextDescription = {
      id: textDescriptionId,
      text: '',
    };
    const textToolDescription: m.TextToolDescription = {
      id: textToolDescriptionId,
      type: ToolNames.TEXT,
      content: textDescriptionId,
    };

    this.store.dispatch(filesActions.insertNewTextStorageUnit({ textDescription }));
    this.store.dispatch(toolsActions.insertNewTextTool({ textToolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: textToolDescriptionId }));
  }

  createNewAudioTool(pageId: string, fileNames: string[]) {
    const audioToolDescriptionId = uuidv4();
    const filesDescriptions: m.AudioFileDescription[] = fileNames.map((name) => ({
      id: uuidv4(),
      pathToFile: name,
    }));
    const fileDescriptionIds = filesDescriptions.map((d) => d.id);

    const audioToolDescription: m.AudioToolDescription = {
      id: audioToolDescriptionId,
      type: ToolNames.AUDIO,
      content: fileDescriptionIds,
    };
    this.store.dispatch(filesActions.insertNewAudioFilesDescriptions({ filesDescriptions }));
    this.store.dispatch(toolsActions.insertNewAudioTool({ audioToolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: audioToolDescriptionId }));
  }

  createNewVideoTool(pageId: string, fileName: string) {
    const videoToolDescriptionId = uuidv4();
    const fileDescriptionId = uuidv4();
    const fileDescription: m.VideoFileDescription = {
      id: fileDescriptionId,
      pathToFile: fileName,
    };
    const videoToolDescription: m.VideoToolDescription = {
      id: videoToolDescriptionId,
      type: ToolNames.VIDEO,
      content: fileDescriptionId,
    };
    this.store.dispatch(filesActions.insertNewVideoFileDescription({ fileDescription }));
    this.store.dispatch(toolsActions.insertNewVideoTool({ videoToolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: videoToolDescriptionId }));
  }

  createNewPDFTool(pageId: string, fileNames: string[]) {
    const PDFToolDescriptionId = uuidv4();
    const filesDescriptions: m.PDFFileDescription[] = fileNames.map((name) => ({
      id: uuidv4(),
      pathToFile: name,
    }));
    const fileDescriptionIds = filesDescriptions.map((d) => d.id);

    const PDFToolDescription: m.PDFToolDescription = {
      id: PDFToolDescriptionId,
      type: ToolNames.PDF,
      content: fileDescriptionIds,
    };
    this.store.dispatch(filesActions.insertNewPDFFilesDescriptions({ filesDescriptions }));
    this.store.dispatch(toolsActions.insertNewPDFTool({ PDFToolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: PDFToolDescriptionId }));
  }

  createNewCollageTool(pageId: string, fileNames: string[]) {
    const collageToolDescriptionId = uuidv4();
    const filesDescriptions: m.ImageFileDescription[] = fileNames.map((name) => ({
      id: uuidv4(),
      pathToFile: name,
      width: Defaults.defaultImageWidth,
    }));
    const fileDescriptionIds: m.FileDescriptionId[] = filesDescriptions.map((d) => d.id);

    const collageToolDescription: m.CollageToolDescription = {
      id: collageToolDescriptionId,
      type: ToolNames.COLLAGE,
      content: fileDescriptionIds,
      currentJustifyContent: Defaults.justifyContent,
      currentAlignItems: Defaults.alignItems,
      currentFlow: Defaults.flow,
    };
    this.store.dispatch(filesActions.insertNewImageFilesDescriptions({ filesDescriptions }));
    this.store.dispatch(toolsActions.insertNewCollageTool({ collageToolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: collageToolDescriptionId }));
  }

  createNewSliderTool(pageId: string, fileNames: string[]) {
    const sliderToolDescriptionId = uuidv4();
    const filesDescriptions: m.ImageFileDescription[] = fileNames.map((name) => ({
      id: uuidv4(),
      pathToFile: name,
      width: Defaults.defaultImageWidth,
    }));
    const fileDescriptionIds: m.FileDescriptionId[] = filesDescriptions.map((d) => d.id);

    const sliderToolDescription: m.SliderToolDescription = {
      id: sliderToolDescriptionId,
      type: ToolNames.SLIDER,
      content: fileDescriptionIds,
    };
    this.store.dispatch(filesActions.insertNewImageFilesDescriptions({ filesDescriptions }));
    this.store.dispatch(toolsActions.insertNewSliderTool({ sliderToolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: sliderToolDescriptionId }));
  }
}
