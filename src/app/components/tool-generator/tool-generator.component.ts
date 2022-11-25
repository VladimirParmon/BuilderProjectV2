import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileDescriptionId, ToolDescription } from 'src/constants/models';
import { ModalWindowsText, ToolNames } from 'src/constants/constants';
import { animate, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmActionComponent } from '../modals/confirm-action/confirm-action.component';
import { Store } from '@ngrx/store';
import { selectToolDescription } from 'src/redux/selectors/tools.selectors';
import { contentsActions } from 'src/redux/actions/contents.actions';
import { filesActions } from 'src/redux/actions/files.actions';
import { toolsActions } from 'src/redux/actions/tools.actions';

@Component({
  selector: 'app-tool-generator',
  templateUrl: './tool-generator.component.html',
  styleUrls: ['./tool-generator.component.scss'],
  animations: [
    trigger('fold', [
      transition(':enter', [
        style({ height: 0, width: 0 }),
        animate('0.3s ease', style({ height: '*' })),
        animate('1s ease', style({ width: '*' })),
      ]),
      transition(':leave', [
        style({ height: '*', width: '*' }),
        animate('0.6s ease', style({ width: 0 })),
        animate('0.3s ease', style({ height: 0 })),
      ]),
    ]),
  ],
})
export class ToolGeneratorComponent implements OnInit, OnDestroy {
  @Input() toolDescriptionId: string = '';
  @Input() pageId: string = '';
  names = ToolNames;
  toolDescription: ToolDescription | null = null;

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private stateService: StateService,
    private utilsService: UtilsService,
    public dialog: MatDialog,
    public store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectToolDescription(this.toolDescriptionId))
      .pipe(takeUntil(this.destroy$))
      .subscribe((toolData) => {
        if (toolData) this.toolDescription = toolData;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  delete() {
    if (this.toolDescription) {
      const toolDescriptionId = this.toolDescriptionId;
      const pageId = this.pageId;

      this.store.dispatch(contentsActions.deleteTool({ pageId, toolDescriptionId }));
      this.store.dispatch(toolsActions.deleteTool({ toolDescriptionId }));

      const toolType = this.toolDescription.type;
      if (toolType === ToolNames.TEXT) {
        this.deleteTextToolStorageUnit();
      } else if (toolType === ToolNames.VIDEO) {
        this.deleteRelatedVideoStorageUnit();
      } else {
        const fileDescriptionIds = this.toolDescription.content;
        if (this.utilsService.isNonEmptyArrayOfStrings(fileDescriptionIds)) {
          switch (toolType) {
            case ToolNames.COLLAGE:
              this.deleteAllCollageImages(fileDescriptionIds);
              break;
            case ToolNames.PDF:
              this.deleteAllRelatedPDFs(fileDescriptionIds);
              break;
          }
        }
      }
    }
  }

  deleteTextToolStorageUnit() {
    if (this.toolDescription) {
      const storageUnitDescriptionId = this.toolDescription.content;
      if (this.utilsService.isString(storageUnitDescriptionId)) {
        this.store.dispatch(filesActions.deleteTextStorageUnit({ id: storageUnitDescriptionId }));
      }
    }
  }

  deleteRelatedVideoStorageUnit() {
    if (this.toolDescription) {
      const fileDescriptionId = this.toolDescription.content;
      if (this.utilsService.isString(fileDescriptionId)) {
        this.store.dispatch(filesActions.deleteVideo({ fileDescriptionId }));
      }
    }
  }

  deleteAllCollageImages(imageDescriptionIds: string[]) {
    this.store.dispatch(filesActions.deleteMultipleImages({ imageDescriptionIds }));
  }

  deleteAllRelatedPDFs(fileDescriptionIds: string[]) {
    this.store.dispatch(filesActions.deleteMultiplePDFs({ fileDescriptionIds }));
  }

  openDeleteDialog() {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['delete-page-dialog'], //TODO: change this
      ModalWindowsText.DELETE_TOOL,
      15
    );
    const dialogRef = this.dialog.open(ConfirmActionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((positiveAnswer) => {
      if (positiveAnswer) this.delete();
    });
  }

  getNotification() {
    this.delete();
  }

  getToolContentsClone() {
    if (this.toolDescription) {
      const x = this.toolDescription.content as FileDescriptionId[];
      return this.utilsService.arrayDeepCopy(x);
    }
    return [];
  }
}
