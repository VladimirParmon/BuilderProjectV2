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

  prepareDragDrop(nodes: SinglePageInfo[]) {
    let dropTargetIds: string[] = [];
    let nodeLookup: Lookup = {};
    nodes.forEach((node) => {
      dropTargetIds.push(node.id);
      nodeLookup[node.id] = node;
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
    allPagesData: SinglePageInfo[],
    dropTargetIds: string[]
  ) {
    if (!this.dropActionToDo) return;

    const draggedItemId: string = event.item.data;
    const oldParentNodeId: string = nodeLookup[draggedItemId].parentId;

    if (this.dropActionToDo.action === ActionCases.OUT_OF_BOUNDS) {
      this.dispatchDNDOutOfBounds(draggedItemId, oldParentNodeId);
      return;
    }

    if (
      nodeLookup[this.dropActionToDo.targetId].parentId ||
      this.dropActionToDo.action === ActionCases.INSIDE
    ) {
      const newParentNodeId =
        this.dropActionToDo.action === ActionCases.INSIDE
          ? nodeLookup[this.dropActionToDo.targetId].id
          : nodeLookup[this.dropActionToDo.targetId].parentId;

      const newParentNodeChildren = allPagesData.find(
        (page) => page.id === newParentNodeId
      )?.childPages;
      if (!newParentNodeChildren) return;

      const newParentIndex = this.getNewParentIndex(newParentNodeChildren);
      if (newParentIndex === -1) return;

      const finalArrayThatGoesToTheStore = this.utilsService.moveInArray(
        newParentNodeChildren,
        newParentIndex,
        draggedItemId
      );

      this.dispatchStandardDNDOperationResult(
        newParentNodeId,
        finalArrayThatGoesToTheStore,
        draggedItemId,
        oldParentNodeId
      );
    } else {
      const targetNode = nodeLookup[draggedItemId];
      const newParentIndex = this.getNewParentIndex(dropTargetIds);
      if (newParentIndex === -1) return;
      const finalArrayThatGoesToTheStore = this.utilsService.moveInArray(
        allPagesData,
        newParentIndex,
        targetNode
      );
      this.dispatchParentlessDNDOperationResult(finalArrayThatGoesToTheStore);
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
    finalArrayThatGoesToTheStore: string[],
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
        newArray: finalArrayThatGoesToTheStore,
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
