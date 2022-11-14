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

  moveInArray(arr: any, oldIndex: number, newIndex: number) {
    const arrayDeepCopy = JSON.parse(JSON.stringify(arr));
    arrayDeepCopy.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arrayDeepCopy;
  }
}
