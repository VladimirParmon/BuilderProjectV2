import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filesActions } from 'src/redux/actions/files.actions';
import { v4 as uuidv4 } from 'uuid';
import * as m from 'src/constants/models';
import { UtilsService } from './utils.service';
import { Defaults } from './defaults';

@Injectable({
  providedIn: 'root',
})
export class StorageUnitsService {
  constructor(private store: Store, private utilsService: UtilsService) {}

  deleteTextToolStorageUnit(id: string) {
    this.store.dispatch(filesActions.deleteTextStorageUnit({ id }));
  }

  deleteRelatedVideoStorageUnit(fileDescriptionId: string) {
    this.store.dispatch(filesActions.deleteVideo({ fileDescriptionId }));
  }

  deleteRelatedChartStorageUnit(id: string) {
    this.store.dispatch(filesActions.deleteChart({ id }));
  }

  deleteAllCollageImages(imageDescriptionIds: string[]) {
    this.store.dispatch(filesActions.deleteMultipleImages({ imageDescriptionIds }));
  }

  deleteAllRelatedPDFs(fileDescriptionIds: string[]) {
    this.store.dispatch(filesActions.deleteMultiplePDFs({ fileDescriptionIds }));
  }

  deleteAllRelatedAudios(fileDescriptionIds: string[]) {
    this.store.dispatch(filesActions.deleteMultipleAudios({ fileDescriptionIds }));
  }

  createAudioDescriptions(fileNames: string[]) {
    const filesDescriptions: m.AudioFileDescription[] = fileNames.map((name) => ({
      id: uuidv4(),
      pathToFile: this.utilsService.getTempFilesPath(name),
    }));
    const fileDescriptionIds = filesDescriptions.map((d) => d.id);
    return { filesDescriptions, fileDescriptionIds };
  }

  createPDFDescriptions(fileNames: string[]) {
    const filesDescriptions: m.PDFFileDescription[] = fileNames.map((name) => ({
      id: uuidv4(),
      pathToFile: this.utilsService.getTempFilesPath(name),
    }));
    const fileDescriptionIds = filesDescriptions.map((d) => d.id);
    return { filesDescriptions, fileDescriptionIds };
  }

  createImageDescriptions(fileNames: string[]) {
    const filesDescriptions: m.ImageFileDescription[] = fileNames.map((name) => ({
      id: uuidv4(),
      pathToFile: this.utilsService.getTempFilesPath(name),
      width: Defaults.defaultImageWidth,
    }));
    const fileDescriptionIds: m.FileDescriptionId[] = filesDescriptions.map((d) => d.id);
    return { filesDescriptions, fileDescriptionIds };
  }
}
