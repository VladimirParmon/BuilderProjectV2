import { Injectable } from '@angular/core';
import { ChartDescription } from 'src/constants/models/charts';
import {
  BasicFileDescription,
  ImageFileDescription,
  TextDescription,
} from 'src/constants/models/files';
import { CollageToolDescription, TextToolDescription } from 'src/constants/models/tools';

@Injectable({
  providedIn: 'root',
})
export class ChecksService {
  public isDefined<T>(arg: T | null | undefined): arg is T extends null | undefined ? never : T {
    return arg !== null && arg !== undefined;
  }

  isString(value: unknown): value is string {
    return typeof value === 'string' ? true : false;
  }

  isNonEmptyArrayOfStrings = (value: unknown): value is string[] => {
    return Array.isArray(value) && value.length > 0 && value.every((item) => this.isString(item));
  };

  isValidBasicFileDescription = (object: any): object is BasicFileDescription => {
    if (!object) return false;
    return object.id && object.pathToFile ? true : false;
  };

  isBasicFileDescriptionArray = (array: any[]): array is BasicFileDescription[] => {
    return array.reduce((_, next) => {
      return this.isValidBasicFileDescription(next);
    }, false);
  };

  isValidImageFileDescription = (object: any): object is ImageFileDescription => {
    if (!object) return false;
    return object.width && this.isValidBasicFileDescription(object);
  };

  isValidImageFileDescriptionArray = (array: any[]): array is ImageFileDescription[] => {
    return array.reduce((_, next) => {
      return this.isValidImageFileDescription(next) ? true : false;
    }, false);
  };

  isValidBasicToolDescription = (object: any): object is BasicFileDescription => {
    if (!object) return false;
    return Boolean(object.id && object.type && object.content);
  };

  isValidCollageToolDescription = (object: any): object is CollageToolDescription => {
    if (!object) return false;
    return (
      object.currentJustifyContent &&
      object.currentAlignItems &&
      object.currentFlow &&
      this.isValidBasicToolDescription(object)
    );
  };

  isValidChartDescription(object: any): object is ChartDescription {
    if (!object) return false;
    return object.id && object.chartType && object.chartData;
  }

  propertyCheck<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, any> {
    if (!obj) return false;
    return obj.hasOwnProperty(prop);
  }

  isValidTextDescription = (object: any): object is TextDescription => {
    return this.propertyCheck(object, 'id') && this.propertyCheck(object, 'text');
  };
}
