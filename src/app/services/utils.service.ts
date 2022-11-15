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
    const arrayDeepCopy: SinglePageInfo[] = JSON.parse(JSON.stringify(array));
    const parents = arrayDeepCopy.filter((el) => !el.parentId).map((p) => p.id);
    return curse(parents);

    function curse(ids: string[]): RecursiveTreeNode[] {
      if (!ids.length) return [];
      return ids.map((i) => {
        const info = nodeLookup[i];
        return {
          parentNodeId: info.parentId,
          relatedPageId: info.id,
          relatedPageName: info.name,
          childNodes: curse(info.childPages),
        };
      });
    }
  }

  moveInArray<T>(arr: T[], newIndex: number, element: T) {
    let arrayDeepCopy = JSON.parse(JSON.stringify(arr));
    const alreadyThere = arrayDeepCopy.includes(element);

    if (alreadyThere) {
      const oldIndex = arrayDeepCopy.indexOf(element);
      arrayDeepCopy.splice(oldIndex, 1)[0];
    }
    arrayDeepCopy.splice(newIndex, 0, element);
    return arrayDeepCopy;
  }
}
