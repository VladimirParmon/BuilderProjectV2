import { Injectable } from '@angular/core';
import {
  BasicFileDescription,
  ChartDescription,
  CollageToolDescription,
  ImageFileDescription,
  ToolDescription,
} from 'src/constants/models';

@Injectable({
  providedIn: 'root',
})
export class ChecksService {
  constructor() {}

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

  propertyCheck<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, any> {
    if (!obj) return false;
    return obj.hasOwnProperty(prop);
  }

  isBasicToolDescription(object: any): object is BasicFileDescription {
    return (
      this.propertyCheck(object, 'id') &&
      this.propertyCheck(object, 'type') &&
      this.propertyCheck(object, 'content')
    );
  }

  isCollageToolDescription(object: ToolDescription): object is CollageToolDescription {
    return (
      this.propertyCheck(object, 'currentJustifyContent') &&
      this.propertyCheck(object, 'currentAlignItems') &&
      this.propertyCheck(object, 'currentFlow')
    );
  }

  isChartDescription(object: any): object is ChartDescription {
    return (
      this.propertyCheck(object, 'id'),
      this.propertyCheck(object, 'chartType'),
      this.propertyCheck(object, 'chartData')
    );
  }

  isDefined<T>(arg: T | null | undefined): arg is T extends null | undefined ? never : T {
    return arg !== null && arg !== undefined;
  }

  isBasicFileDescription(object: {}): object is BasicFileDescription {
    return this.propertyCheck(object, 'id') && this.propertyCheck(object, 'pathToFile');
  }

  isBasicFileDescriptionArray(array: any[]): array is BasicFileDescription[] {
    return array.reduce((acc, next) => {
      return this.isBasicFileDescription(next);
    }, false);
  }
}
