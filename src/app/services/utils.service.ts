import { Injectable } from '@angular/core';
import {
  Lookup,
  RecursiveTreeNode,
  SinglePageInfo,
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
}
