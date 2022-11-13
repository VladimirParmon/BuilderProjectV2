import { Inject, Injectable } from '@angular/core';
import {
  RecursiveTreeNode,
  DropInfo,
  Lookup,
  ActionCases,
} from 'src/constants/models';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllPagesInfo } from 'src/redux/selectors';
import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { UtilsService } from './utils.service';
import { contentsActions } from 'src/redux/actions';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  contentsData: RecursiveTreeNode[] | null = null;

  dropTargetIds: string[] = [];
  nodeLookup: Lookup = {};
  dropActionToDo: DropInfo | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private utilsService: UtilsService
  ) {
    this.store.select(selectAllPagesInfo).subscribe((data) => {
      if (data) {
        const recursiveTreeNodes: RecursiveTreeNode[] = [...data].map((el) => ({
          parentNodeId: el.parentId,
          relatedPageId: el.id,
          relatedPageName: el.name,
          childNodes: [],
          isExpanded: false,
        }));
        this.prepareDragDrop(recursiveTreeNodes);
        this.contentsData = this.utilsService.arrayToTree(recursiveTreeNodes);
      }
    });
  }

  prepareDragDrop(nodes: RecursiveTreeNode[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.relatedPageId);
      this.nodeLookup[node.relatedPageId] = node;
    });
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

    let container = element.classList.contains('node-item')
      ? element
      : element.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
    }

    const newTargetId: string = container?.getAttribute('data-id') || 'main';
    let newAction = this.chooseActionCase(container, event);
    if (newAction) {
      this.dropActionToDo = {
        targetId: newTargetId,
        action: newAction,
      };
      if (container) this.showDragInfo();
    } else {
      this.clearDragInfo();
      return;
    }
  }

  drop(event: CdkDragDrop<RecursiveTreeNode[] | null, any, any>) {
    if (!this.dropActionToDo) return;

    const draggedItemId: string = event.item.data;
    const oldParentNodeId: string = this.nodeLookup[draggedItemId].parentNodeId;

    if (this.dropActionToDo.targetId !== 'main') {
      const newParentNodeId =
        this.dropActionToDo.action === ActionCases.INSIDE
          ? this.nodeLookup[this.dropActionToDo.targetId].relatedPageId
          : this.nodeLookup[this.dropActionToDo.targetId].parentNodeId;

      const newParentNodeChildren = this.nodeLookup[
        newParentNodeId
      ].childNodes.map((el) => el.relatedPageId);

      const newParentIndex = this.getNewParentIndex(newParentNodeChildren);
      if (!newParentIndex) return;

      const newParentFinalArray = newParentNodeChildren.splice(
        newParentIndex,
        0,
        draggedItemId
      );

      this.dispatchStandardDNDOperationResult(
        newParentNodeId,
        newParentFinalArray,
        draggedItemId,
        oldParentNodeId
      );
    } else {
      this.dispatchParentlessDNDOperationResult(draggedItemId, oldParentNodeId);
    }
  }

  getNewParentIndex(newParentNodeChildren: string[]) {
    if (!this.dropActionToDo) return null;
    let newParentIndex;
    switch (this.dropActionToDo.action) {
      case ActionCases.AFTER:
        newParentIndex =
          newParentNodeChildren.indexOf(this.dropActionToDo.targetId) + 1;
        break;
      case ActionCases.BEFORE:
        newParentIndex =
          newParentNodeChildren.indexOf(this.dropActionToDo.targetId) - 1;
        break;
      case ActionCases.INSIDE:
        newParentIndex = newParentNodeChildren.length + 1;
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
    newParentFinalArray: string[],
    draggedItemId: string,
    oldParentNodeId: string
  ) {
    this.store.dispatch(
      contentsActions.updateWholeChildrenArray({
        targetPageId: newParentNodeId,
        newArray: newParentFinalArray,
      })
    );
    this.store.dispatch(
      contentsActions.changePageParent({
        targetPageId: draggedItemId,
        newParentId: newParentNodeId,
      })
    );
    this.store.dispatch(
      contentsActions.removeChildPage({
        targetPageId: oldParentNodeId,
        pageToRemoveId: draggedItemId,
      })
    );
  }

  dispatchParentlessDNDOperationResult(
    draggedItemId: string,
    oldParentNodeId: string
  ) {
    console.log(draggedItemId, oldParentNodeId);
    this.store.dispatch(
      contentsActions.changePageParent({
        targetPageId: draggedItemId,
        newParentId: '',
      })
    );
    this.store.dispatch(
      contentsActions.removeChildPage({
        targetPageId: oldParentNodeId,
        pageToRemoveId: draggedItemId,
      })
    );
  }

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
