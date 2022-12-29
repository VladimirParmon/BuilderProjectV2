import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { Lookup, RecursiveTreeNode, SinglePageInfo } from 'src/constants/models/contents';
import { inputTypes, MediaFileTypes, ToolNames } from 'src/constants/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  pathToTempFolder = 'assets/tempFiles/';

  constructor(private snackBar: MatSnackBar) {}

  arrayToTree(array: SinglePageInfo[], nodeLookup: Lookup): RecursiveTreeNode[] {
    const arrayDeepCopy = this.arrayDeepCopy(array);
    const parents = arrayDeepCopy.filter((el) => !el.parentId).map((p) => p.id);
    return curse(parents);

    function curse(ids: string[]): RecursiveTreeNode[] {
      if (!ids.length) return [];
      return ids.map((i) => {
        const info = nodeLookup[i];
        return {
          parentNodeId: info.parentId || '',
          relatedPageId: info.id,
          relatedPageName: info.name,
          childNodes: curse(info.childPages),
        };
      });
    }
  }

  moveInArray<T>(array: T[], newIndex: number, element: T) {
    let arrayDeepCopy = this.arrayDeepCopy(array);
    const alreadyThere = array.includes(element);

    if (alreadyThere) {
      const oldIndex = array.indexOf(element);
      arrayDeepCopy.splice(oldIndex, 1)[0];
    }
    arrayDeepCopy.splice(newIndex, 0, element);
    return arrayDeepCopy;
  }

  arrayDeepCopy<T>(array: T[]) {
    return JSON.parse(JSON.stringify(array)) as T[];
  }

  createMatDialogConfig(
    panelClass: string[],
    data?: any,
    position: number = 5,
    autoFocus: boolean = false
  ) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = autoFocus;
    dialogConfig.position = { top: position + '%' };
    dialogConfig.panelClass = panelClass;
    dialogConfig.data = data;
    return dialogConfig;
  }

  static getFileTypeFromToolType(type: ToolNames) {
    switch (type) {
      case ToolNames.TEXT:
        return MediaFileTypes.TEXT;
      case ToolNames.AUDIO:
        return MediaFileTypes.AUDIOS;
      case ToolNames.PDF:
        return MediaFileTypes.PDFs;
      case ToolNames.VIDEO:
        return MediaFileTypes.VIDEOS;
      case ToolNames.CHART:
        return MediaFileTypes.CHARTS;
      default:
        return MediaFileTypes.IMAGES;
    }
  }

  formatBytes(bytes: any, decimals?: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  openSnackBar(message: string, duration?: number, action?: string) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: action ? undefined : 'snackbar-center',
    });
  }

  getTempFilesPath(fileName: string) {
    return this.pathToTempFolder + fileName;
  }

  getFileName(filePath: string) {
    return filePath.replace(this.pathToTempFolder, '');
  }

  removeFileExtension(fileName: string, toolType: ToolNames) {
    let extensionsArray: inputTypes | null = null;
    switch (toolType) {
      case ToolNames.AUDIO:
        extensionsArray = inputTypes.AUDIO;
        break;
    }
    if (extensionsArray) {
      const expressionString = extensionsArray.split(',').join('\\b|\\b');
      return fileName.replace(new RegExp(expressionString, 'gi'), '').trim().replace(/ +/g, ' ');
    } else {
      return fileName;
    }
  }

  getFileNameNoExtension(filePath: string, toolType: ToolNames) {
    const strippedName = this.getFileName(filePath);
    const noExtension = this.removeFileExtension(strippedName, toolType);
    if (strippedName.length > 50) return noExtension.slice(0, 50) + '...';
    return noExtension;
  }
}
