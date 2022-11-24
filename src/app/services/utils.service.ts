import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import {
  CollageToolDescription,
  ImageFileDescription,
  Lookup,
  RecursiveTreeNode,
  SinglePageInfo,
  ToolDescription,
} from 'src/constants/models';
import { MediaFileTypes, ToolNames } from 'src/constants/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
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
      default:
        return MediaFileTypes.IMAGES;
    }
  }

  isNonEmptyArrayOfStrings(value: unknown): value is string[] {
    return (
      Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string')
    );
  }

  isString(value: unknown): value is string {
    return typeof value === 'string' ? true : false;
  }

  isImageFileDescription(value: unknown): value is ImageFileDescription {
    if (!value) return false;
    const x = value as ImageFileDescription;
    if (x.id && x.pathToFile && x.width) return true;
    return false;
  }

  isImageFileDescriptionArray(array: unknown[]): array is ImageFileDescription[] {
    let x = array as ImageFileDescription[];
    const typeIsOk: boolean = x.reduce((acc, next) => {
      if (!this.isImageFileDescription(acc) && !this.isImageFileDescription(next)) return false;
      return true;
    }, false);
    return typeIsOk;
  }

  propertyCheck<X extends {}, Y extends PropertyKey>(
    obj: X,
    prop: Y
  ): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
  }

  isCollageToolDescription(object: ToolDescription): object is CollageToolDescription {
    return (
      this.propertyCheck(object, 'currentJustifyContent') &&
      this.propertyCheck(object, 'currentAlignItems') &&
      this.propertyCheck(object, 'currentFlow')
    );
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

  openSnackBar(message: string, action?: string, duration?: number) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: action ? undefined : 'snackbar-center',
    });
  }

  getTempFilesPath(fileName: string) {
    return 'assets/tempFiles/' + fileName;
  }

  isDefined<T>(arg: T | null | undefined): arg is T extends null | undefined ? never : T {
    return arg !== null && arg !== undefined;
  }
}
