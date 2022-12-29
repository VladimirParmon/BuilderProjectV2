import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as m from 'src/constants/models/tools';
import { contentsActions } from 'src/redux/actions/contents.actions';
import { filesActions } from 'src/redux/actions/files.actions';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { v4 as uuidv4 } from 'uuid';
import { ChartTypes, ToolNames } from 'src/constants/constants';
import { Defaults } from './defaults';
import { UtilsService } from './utils.service';
import { StorageUnitsService } from './storage-units.service';
import {
  TextDescription,
  TextDescriptionId,
  VideoFileDescription,
} from 'src/constants/models/files';
import { ChartDescription } from 'src/constants/models/charts';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  constructor(
    private store: Store,
    private utilsService: UtilsService,
    private storageUnitsService: StorageUnitsService
  ) {}

  createNewTextTool(pageId: string) {
    const textDescriptionId: TextDescriptionId = uuidv4();
    const textToolDescriptionId: m.ToolDescriptionId = uuidv4();

    const textDescription: TextDescription = {
      id: textDescriptionId,
      text: '',
    };
    const toolDescription: m.TextToolDescription = {
      id: textToolDescriptionId,
      type: ToolNames.TEXT,
      content: textDescriptionId,
    };

    this.store.dispatch(filesActions.insertNewTextStorageUnit({ textDescription }));
    this.store.dispatch(toolsActions.insertNewTextTool({ toolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: textToolDescriptionId }));
  }

  createNewAudioTool(pageId: string, fileNames: string[]) {
    const audioToolDescriptionId = uuidv4();
    const { filesDescriptions, fileDescriptionIds } =
      this.storageUnitsService.createAudioDescriptions(fileNames);

    const toolDescription: m.AudioToolDescription = {
      id: audioToolDescriptionId,
      type: ToolNames.AUDIO,
      content: fileDescriptionIds,
    };
    this.store.dispatch(filesActions.insertNewAudioFilesDescriptions({ filesDescriptions }));
    this.store.dispatch(toolsActions.insertNewAudioTool({ toolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: audioToolDescriptionId }));
  }

  createNewVideoTool(pageId: string, fileName: string) {
    const videoToolDescriptionId = uuidv4();
    const fileDescriptionId = uuidv4();
    const fileDescription: VideoFileDescription = {
      id: fileDescriptionId,
      pathToFile: this.utilsService.getTempFilesPath(fileName),
    };
    const toolDescription: m.VideoToolDescription = {
      id: videoToolDescriptionId,
      type: ToolNames.VIDEO,
      content: fileDescriptionId,
    };
    this.store.dispatch(filesActions.insertNewVideoFileDescription({ fileDescription }));
    this.store.dispatch(toolsActions.insertNewVideoTool({ toolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: videoToolDescriptionId }));
  }

  createNewPDFTool(pageId: string, fileNames: string[]) {
    const PDFToolDescriptionId = uuidv4();
    const { filesDescriptions, fileDescriptionIds } =
      this.storageUnitsService.createPDFDescriptions(fileNames);

    const toolDescription: m.PDFToolDescription = {
      id: PDFToolDescriptionId,
      type: ToolNames.PDF,
      content: fileDescriptionIds,
    };

    this.store.dispatch(filesActions.insertNewPDFFilesDescriptions({ filesDescriptions }));
    this.store.dispatch(toolsActions.insertNewPDFTool({ toolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: PDFToolDescriptionId }));
  }

  createNewCollageTool(pageId: string, fileNames: string[]) {
    const collageToolDescriptionId = uuidv4();
    const { filesDescriptions, fileDescriptionIds } =
      this.storageUnitsService.createImageDescriptions(fileNames);

    const toolDescription: m.CollageToolDescription = {
      id: collageToolDescriptionId,
      type: ToolNames.COLLAGE,
      content: fileDescriptionIds,
      currentJustifyContent: Defaults.justifyContent,
      currentAlignItems: Defaults.alignItems,
      currentFlow: Defaults.flow,
    };

    this.store.dispatch(filesActions.insertNewImageFilesDescriptions({ filesDescriptions }));
    this.store.dispatch(toolsActions.insertNewCollageTool({ toolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: collageToolDescriptionId }));
  }

  createNewSliderTool(pageId: string, fileNames: string[]) {
    const sliderToolDescriptionId = uuidv4();
    const { filesDescriptions, fileDescriptionIds } =
      this.storageUnitsService.createImageDescriptions(fileNames);

    const toolDescription: m.SliderToolDescription = {
      id: sliderToolDescriptionId,
      type: ToolNames.SLIDER,
      content: fileDescriptionIds,
    };
    this.store.dispatch(filesActions.insertNewImageFilesDescriptions({ filesDescriptions }));
    this.store.dispatch(toolsActions.insertNewSliderTool({ toolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: sliderToolDescriptionId }));
  }

  createNewChartTool(pageId: string, chartType: ChartTypes) {
    const chartStorageUnitDescriptionId = uuidv4();
    const chartToolDescriptionId = uuidv4();
    const chartStorageUnitDescription: ChartDescription = {
      id: chartStorageUnitDescriptionId,
      chartType,
      chartData: Defaults.getChartExample(chartType),
    };
    const toolDescription: m.ChartToolDescription = {
      id: chartToolDescriptionId,
      type: ToolNames.CHART,
      content: chartStorageUnitDescriptionId,
    };

    this.store.dispatch(filesActions.insertNewChartDescription({ chartStorageUnitDescription }));
    this.store.dispatch(toolsActions.insertNewChartTool({ toolDescription }));
    this.store.dispatch(contentsActions.addTool({ pageId, toolId: chartToolDescriptionId }));
  }
}
