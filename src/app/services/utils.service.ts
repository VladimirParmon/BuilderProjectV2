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
}
