import { Injectable } from '@angular/core';
import { RecursiveTreeNode } from 'src/constants/models';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  arrayToTree(array: RecursiveTreeNode[], parentId = ''): RecursiveTreeNode[] {
    return array
      .filter((item) => item.parentNodeId === parentId)
      .map((child: RecursiveTreeNode) => ({
        ...child,
        childNodes: this.arrayToTree(array, child.relatedPageId),
      }));
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
