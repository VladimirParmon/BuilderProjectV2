import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { TreeService } from 'src/app/services/tree.service';
import {
  RecursiveTreeNode,
  ExpandButtonState,
  SinglePageInfo,
  Lookup,
  DropInfo,
} from 'src/constants/models';
import { ModalWindowsText, ExpandButtonInnerText } from 'src/constants/constants';
import { selectAllPagesInfo } from 'src/redux/selectors/contents.selectors';
import { tap } from 'rxjs';
import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';
import { EnterNameComponent } from '../../modals/enter-name/enter-name.component';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { contentsActions } from 'src/redux/actions/contents.actions';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss'],
  animations: [
    trigger('animate', [
      transition('void => *', [style({ width: '0' }), animate(100, style({ width: '*' }))]),
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
export class ContentsComponent implements OnDestroy {
  isMenuOpen$: BehaviorSubject<boolean> = this.stateService.isContentsMenuOpen$;
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  expandButtonState: ExpandButtonState = {
    expanded: false,
    text: {
      open: ExpandButtonInnerText.OPEN,
      close: ExpandButtonInnerText.CLOSE,
    },
  };

  isDraggable: boolean = false;
  nodesThatAreExpanded: string[] = [];

  storeSubscription: Subscription;
  fetchedData: SinglePageInfo[] | null = null;
  contentsData: RecursiveTreeNode[] | null = null;
  dropTargetIds: string[] = [];
  nodeLookup: Lookup = {};
  dropActionToDo: DropInfo | null = null;

  constructor(
    public treeService: TreeService,
    public stateService: StateService,
    public utilsService: UtilsService,
    private store: Store,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.storeSubscription = this.store
      .select(selectAllPagesInfo)
      .pipe(
        tap((raw) => {
          if (raw) {
            const { dropTargetIds, nodeLookup } = this.treeService.prepareDragDrop(raw);
            this.dropTargetIds = dropTargetIds;
            this.nodeLookup = nodeLookup;
            this.contentsData = this.utilsService.arrayToTree(raw, nodeLookup);
          }
        })
      )
      .subscribe((data) => {
        if (data) {
          this.fetchedData = data;
        }
      });
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

  toggleGlobalEdit(checkboxValue: boolean) {
    if (checkboxValue === false) {
      this.isDraggable = false;
      this.utilsService.openSnackBar('Не забудьте сохранить изменения', undefined, 1000);
    }
    this.stateService.isGlobalEditOn$.next(checkboxValue);
  }

  getPageNameById(id: string) {
    return this.fetchedData?.find((page) => page.id === id)?.id;
  }

  navigate(id: string) {
    this.router.navigate(['/view', id]);
  }

  //Tree controls ---------------------------------------------------------
  expandNodeSwitch(nodeId: string) {
    const isAlreadyExpanded = this.isNodeExpanded(nodeId);
    isAlreadyExpanded
      ? (this.nodesThatAreExpanded = this.nodesThatAreExpanded.filter((el) => el !== nodeId))
      : this.nodesThatAreExpanded.push(nodeId);
  }

  isNodeExpanded(nodeId: string) {
    return this.nodesThatAreExpanded.includes(nodeId);
  }

  wholeTreeExpansionSwitch() {
    this.expandButtonState.expanded
      ? (this.nodesThatAreExpanded = [])
      : (this.nodesThatAreExpanded = this.dropTargetIds);
    this.expandButtonState.expanded = !this.expandButtonState.expanded;
  }

  saveTree(treeData: RecursiveTreeNode[] | null) {
    //if (treeData) this.stateService.write(treeData); //TODO: make an API call to save JSON
  }

  //Drag and drop handlers ---------------------------------------------------------
  dragMoved(event: CdkDragMove) {
    this.treeService.dragMoved(event);
  }

  drop(event: CdkDragDrop<RecursiveTreeNode[] | null, any, any>) {
    if (!this.fetchedData) return;
    this.treeService.drop(event, this.nodeLookup, this.fetchedData, this.dropTargetIds);
  }

  toggleDND(checkboxValue: boolean) {
    this.isDraggable = checkboxValue;
  }

  //Dialog modal windows ---------------------------------------------------------
  openAddNewPageDialog() {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['add-page-dialog'],
      ModalWindowsText.CREATE_NEW_PAGE
    );
    const dialogRef = this.dialog.open(EnterNameComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((pageName) => {
      const newPage: SinglePageInfo = {
        id: uuidv4(),
        name: pageName,
        tools: [],
        childPages: [],
        parentId: '',
      };
      this.store.dispatch(contentsActions.addNewPage({ pageInfo: newPage }));
    });
  }

  openDeletePageDialog(nodeId: string) {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['delete-page-dialog'],
      ModalWindowsText.DELETE_PAGE + ' ' + this.getPageNameById(nodeId) + '?'
    );
    const dialogRef = this.dialog.open(ConfirmActionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((positiveAnswer) => {
      if (positiveAnswer) this.store.dispatch(contentsActions.deletePage({ pageId: nodeId }));
    });
  }

  openGenerateSiteDialog() {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['add-page-dialog'], //TODO: change this
      ModalWindowsText.GENERATE_SITE
    );
    const dialogRef = this.dialog.open(EnterNameComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((siteName) => {
      //if (siteName) do smth; //TODO: send generate call to API
    });
  }
}
