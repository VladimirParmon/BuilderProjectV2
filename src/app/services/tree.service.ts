import { Inject, Injectable } from '@angular/core';
import {
  RecursiveTreeNode,
  DropInfo,
  Lookup,
  ActionCases,
  SinglePageInfo,
} from 'src/constants/models';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { UtilsService } from './utils.service';
import { contentsActions } from 'src/redux/actions';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  dropActionToDo: DropInfo | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private utilsService: UtilsService
  ) {}

  buildRecursiveTreeNodes(data: SinglePageInfo[]) {
    const recursiveTreeNodes: RecursiveTreeNode[] = [...data].map((el) => ({
      parentNodeId: el.parentId,
      relatedPageId: el.id,
      relatedPageName: el.name,
      childNodes: [],
    }));
    return recursiveTreeNodes;
  }

  buildRecursiveTree(recursiveTreeNodes: RecursiveTreeNode[]) {
    return this.utilsService.arrayToTree(recursiveTreeNodes);
  }

  prepareDragDrop(nodes: RecursiveTreeNode[]) {
    let dropTargetIds: string[] = [];
    let nodeLookup: Lookup = {};
    nodes.forEach((node) => {
      dropTargetIds.push(node.relatedPageId);
      nodeLookup[node.relatedPageId] = node;
    });
    return { dropTargetIds, nodeLookup };
  }

  dragMoved(event: CdkDragMove) {
    let element = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );
    if (!element) {
      this.clearDragInfo();
      return;
    }

    const container = this.getContainer(element);
    if (container) {
      const newTargetId: string =
        container.getAttribute('data-id') ||
        'Something went wrong. Check the DOM tree';
      const newAction = this.chooseActionCase(container, event);
      this.dropActionToDo = {
        targetId: newTargetId,
        action: newAction,
      };
      this.showDragInfo();
    } else {
      this.dropActionToDo = {
        targetId: 'No target id is required here',
        action: ActionCases.OUT_OF_BOUNDS,
      };
    }
  }

  getContainer(element: Element) {
    return element.classList.contains('node-item')
      ? element
      : element.closest('.node-item');
  }

  drop(
    event: CdkDragDrop<RecursiveTreeNode[] | null, any, any>,
    nodeLookup: Lookup,
    allPagesData: SinglePageInfo[]
  ) {
    if (!this.dropActionToDo) return;

    const draggedItemId: string = event.item.data;
    const oldParentNodeId: string = nodeLookup[draggedItemId].parentNodeId;

    if (this.dropActionToDo.action === ActionCases.OUT_OF_BOUNDS) {
      this.dispatchDNDOutOfBounds(draggedItemId, oldParentNodeId);
      return;
    }

    if (
      nodeLookup[this.dropActionToDo.targetId].parentNodeId ||
      this.dropActionToDo.action === ActionCases.INSIDE
    ) {
      const newParentNodeId =
        this.dropActionToDo.action === ActionCases.INSIDE
          ? nodeLookup[this.dropActionToDo.targetId].relatedPageId
          : nodeLookup[this.dropActionToDo.targetId].parentNodeId;

      const newParentNodeChildren = allPagesData.find(
        (page) => page.id === newParentNodeId
      )?.childPages;
      if (!newParentNodeChildren) return;
      console.log('new Parent Children found');

      const newParentIndex = this.getNewParentIndex(newParentNodeChildren);
      if (newParentIndex === -1) return;
      console.log('new index found');

      const final = this.utilsService.moveInArray(
        newParentNodeChildren,
        newParentIndex,
        draggedItemId
      );

      this.dispatchStandardDNDOperationResult(
        newParentNodeId,
        final,
        draggedItemId,
        oldParentNodeId
      );
    } else {
      console.log('block 2');
      // const store = [...this.allPagesData];
      // const storeLookup = store.map((el) => el.id);
      // const oldIndex = storeLookup.indexOf(draggedItemId);
      // const newIndex = this.getNewParentIndex(storeLookup);
      // const draggedItem = this.allPagesData.find(
      //   (el) => el.id === draggedItemId
      // );
      // if (!newIndex) return;
      // if (!draggedItem) return;
      // const newArray = this.utilsService.moveInArray(store, oldIndex, newIndex);
      // this.dispatchParentlessDNDOperationResult(newArray);
    }
  }

  getNewParentIndex(newParentNodeChildren: string[]) {
    if (!this.dropActionToDo) return -1;
    let newParentIndex = -1;
    switch (this.dropActionToDo.action) {
      case ActionCases.AFTER:
        newParentIndex =
          newParentNodeChildren.indexOf(this.dropActionToDo.targetId) + 1;
        break;
      case ActionCases.BEFORE:
        newParentIndex = newParentNodeChildren.indexOf(
          this.dropActionToDo.targetId
        );
        break;
      case ActionCases.INSIDE:
        newParentIndex = newParentNodeChildren.length;
        break;
    }
    return newParentIndex;
  }

  chooseActionCase(container: Element | null, event: CdkDragMove) {
    let newAction: ActionCases;
    if (container) {
      const targetRect = container.getBoundingClientRect();
      const oneThird = targetRect.height / 3;
      if (event.pointerPosition.y - targetRect.top < oneThird) {
        newAction = ActionCases.BEFORE;
      } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
        newAction = ActionCases.AFTER;
      } else {
        newAction = ActionCases.INSIDE;
      }
    } else {
      newAction = ActionCases.AFTER;
    }
    return newAction;
  }

  dispatchStandardDNDOperationResult(
    newParentNodeId: string,
    newParentNodeChildren: string[],
    draggedItemId: string,
    oldParentNodeId?: string
  ) {
    if (oldParentNodeId) {
      this.store.dispatch(
        contentsActions.removeChildPage({
          targetPageId: oldParentNodeId,
          pageToRemoveId: draggedItemId,
        })
      );
    }
    this.store.dispatch(
      contentsActions.updateWholeChildrenArray({
        targetPageId: newParentNodeId,
        newArray: newParentNodeChildren,
      })
    );
    this.store.dispatch(
      contentsActions.changePageParent({
        targetPageId: draggedItemId,
        newParentId: newParentNodeId,
      })
    );
  }

  dispatchDNDOutOfBounds(draggedItemId: string, oldParentNodeId?: string) {
    if (oldParentNodeId) {
      this.store.dispatch(
        contentsActions.removeChildPage({
          targetPageId: oldParentNodeId,
          pageToRemoveId: draggedItemId,
        })
      );
    }
    this.store.dispatch(
      contentsActions.changePageParent({
        targetPageId: draggedItemId,
        newParentId: '',
      })
    );
  }

  dispatchParentlessDNDOperationResult(newArray: SinglePageInfo[]) {
    this.store.dispatch(contentsActions.updateWholeSlice({ newArray }));
  }

  // expansionHandler(node: RecursiveTreeNode) {
  //   if (node.isExpanded) {
  //     this.nodesThatAreExpanded = this.nodesThatAreExpanded.filter(
  //       (el) => el !== node.relatedPageId
  //     );
  //   } else {
  //     this.nodesThatAreExpanded.push(node.relatedPageId);
  //   }
  //   node.isExpanded = !node.isExpanded;
  // }

  //Visuals------------------------------------------------------------------

  showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionToDo) {
      this.document
        .getElementById('node-' + this.dropActionToDo.targetId)!
        .classList.add('drop-' + this.dropActionToDo.action);
    }
  }

  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionToDo = null;
    }
    this.document
      .querySelectorAll('.drop-before')
      .forEach((element) => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach((element) => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach((element) => element.classList.remove('drop-inside'));
  }
}
