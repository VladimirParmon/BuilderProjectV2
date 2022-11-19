import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import {
  Lookup,
  MediaFileTypes,
  RecursiveTreeNode,
  SinglePageInfo,
  ToolNames,
} from 'src/constants/models';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  arrayToTree(
    array: SinglePageInfo[],
    nodeLookup: Lookup
  ): RecursiveTreeNode[] {
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
      default:
        return null;
    }
  }

  isNonEmptyArrayOfStrings(value: unknown): value is string[] {
    return (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => typeof item === 'string')
    );
  }

  isString(value: unknown): value is string {
    return typeof value === 'string' ? true : false;
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
}
