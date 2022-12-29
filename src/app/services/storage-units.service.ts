import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import * as m from 'src/constants/models/files';
import { UtilsService } from './utils.service';
import { Defaults } from './defaults';

@Injectable({
  providedIn: 'root',
})
export class StorageUnitsService {
  constructor(private utilsService: UtilsService) {}

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
