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

  drop(event: CdkDragDrop<RecursiveTreeNode[] | null, any, any>) {
    if (!this.dropActionToDo) return;

    const draggedItemId: string = event.item.data;
    const parentItemId: string = event.previousContainer.id;
    const targetListId: string = this.getParentNodeId(
      this.dropActionToDo.targetId,
      this.contentsData,
      'main'
    );

    console.log(event);

    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer =
      parentItemId != 'main'
        ? this.nodeLookup[parentItemId].childNodes
        : this.contentsData;
    const newContainer =
      targetListId != 'main'
        ? this.nodeLookup[targetListId].childNodes
        : this.contentsData;

    if (oldItemContainer && newContainer) {
      let i = oldItemContainer.findIndex(
        (c: RecursiveTreeNode) => c.relatedPageId === draggedItemId
      );
      oldItemContainer.splice(i, 1);

      switch (this.dropActionToDo.action) {
        case ActionCases.BEFORE:
        case ActionCases.AFTER:
          const targetIndex = newContainer!.findIndex(
            (c: RecursiveTreeNode) =>
              c.relatedPageId === this.dropActionToDo?.targetId
          );
          this.dropActionToDo.action == ActionCases.BEFORE
            ? newContainer!.splice(targetIndex, 0, draggedItem)
            : newContainer!.splice(targetIndex + 1, 0, draggedItem);
          break;

        case ActionCases.INSIDE:
          {
            const destination = this.nodeLookup[this.dropActionToDo.targetId];
            destination.childNodes.push(draggedItem);
            destination.isExpanded = true;
          }
          break;
      }

      // if (this.contentsData)
      //this.store.dispatch()
      //this.stateService.treeData$.next(this.contentsData);
    }
    this.clearDragInfo(true);
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
      return;
    }

    const newTargetId: string | null = container.getAttribute('data-id');
    let newAction: ActionCases;
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;
    if (event.pointerPosition.y - targetRect.top < oneThird) {
      newAction = ActionCases.BEFORE;
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      newAction = ActionCases.AFTER;
    } else {
      newAction = ActionCases.INSIDE;
    }

    if (newTargetId && newAction) {
      this.dropActionToDo = {
        targetId: newTargetId,
        action: newAction,
      };
      this.showDragInfo();
    } else {
      this.clearDragInfo();
      return;
    }
  }

  getParentNodeId(
    id: string,
    nodesToSearch: RecursiveTreeNode[] | null,
    parentId: string
  ): string {
    if (nodesToSearch) {
      for (let node of nodesToSearch) {
        if (node.relatedPageId == id) return parentId;
        let ret = this.getParentNodeId(id, node.childNodes, node.relatedPageId);
        if (ret !== 'null') return ret;
      }
    }
    return 'null';
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
