import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { TreeService } from 'src/app/services/tree.service';
import {
  RecursiveTreeNode,
  ExpandButtonInnerText,
  ExpandButtonState,
  SinglePageInfo,
} from 'src/constants/models';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss'],
  animations: [
    trigger('animate', [
      transition('void => *', [
        style({ width: '0' }),
        animate(100, style({ width: '*' })),
      ]),
      transition('* => void', [animate(100, style({ width: '0' }))]),
      transition('* => *', animate('300ms ease-out')),
    ]),
    trigger('fold', [
      transition(':enter', [
        style({ height: 0, width: 0, overflow: 'hidden' }),
        animate('0.3s ease', style({ height: '*' })),
        animate('1s ease', style({ width: '*' })),
      ]),
      transition(':leave', [
        style({ height: '*', width: '*', overflow: 'hidden' }),
        animate('0.6s ease', style({ width: 0 })),
        animate('0.3s ease', style({ height: 0 })),
      ]),
    ]),
  ],
})
export class ContentsComponent {
  isMenuOpen$: BehaviorSubject<boolean> = this.stateService.isContentsMenuOpen;
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn;
  expandButtonState: ExpandButtonState = {
    expanded: false,
    text: {
      open: ExpandButtonInnerText.OPEN,
      close: ExpandButtonInnerText.CLOSE,
    },
  };

  isDraggable: boolean = false;
  nodesThatAreExpanded: string[] = [];

  constructor(
    public treeService: TreeService,
    public stateService: StateService,
    private store: Store,
    public dialog: MatDialog
  ) {}

  navigate(id: string) {}
  openDeletePageDialog(id: string) {}

  expandNodeSwitch(nodeId: string) {
    const isAlreadyExpanded = this.isNodeExpanded(nodeId);
    isAlreadyExpanded
      ? (this.nodesThatAreExpanded = this.nodesThatAreExpanded.filter(
          (el) => el !== nodeId
        ))
      : this.nodesThatAreExpanded.push(nodeId);
  }
  isNodeExpanded(nodeId: string) {
    return this.nodesThatAreExpanded.includes(nodeId);
  }
  wholeTreeExpansionSwitch() {
    this.expandButtonState.expanded
      ? (this.nodesThatAreExpanded = [])
      : (this.nodesThatAreExpanded = this.treeService.dropTargetIds);
    this.expandButtonState.expanded = !this.expandButtonState.expanded;
  }

  openAddNewPageDialog() {}

  toggleDND(checkboxValue: boolean) {
    this.isDraggable = checkboxValue;
  }

  toggleGlobalEdit(checkboxValue: boolean) {
    this.isDraggable = false;
    this.stateService.isGlobalEditOn.next(checkboxValue);
  }

  saveTree(treeData: RecursiveTreeNode[] | null) {
    //if (treeData) this.stateService.write(treeData);
  }

  generate() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.position = { top: '5%' };
    dialogConfig.panelClass = ['add-page-dialog'];
    dialogConfig.data = 'Создать новый сайт';

    // let dialogRef = this.dialog.open(NewPageComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((pageName) => {
    //   if (pageName) this.stateService.generate(pageName);
    // });
  }
}
