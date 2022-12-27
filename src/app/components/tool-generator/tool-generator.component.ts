import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToolDescription } from 'src/constants/models';
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
import { toolsActions } from 'src/redux/actions/tools.actions';
import { StorageUnitsService } from 'src/app/services/storage-units.service';
import { ChecksService } from 'src/app/services/checks.service';

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

  hasAlreadyBeenManuallyDeleted = false;

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private stateService: StateService,
    private utilsService: UtilsService,
    public dialog: MatDialog,
    public store: Store,
    private storageUnitsService: StorageUnitsService,
    private checksService: ChecksService
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

  delete(manuallyDeleted?: boolean) {
    if (!this.toolDescription || this.hasAlreadyBeenManuallyDeleted) return;
    if (manuallyDeleted) {
      this.hasAlreadyBeenManuallyDeleted = true;
    } else {
      this.utilsService.openSnackBar('Пустой блок был автоматически удален', 3000);
    }
    const toolDescriptionId = this.toolDescriptionId;
    const pageId = this.pageId;

    this.store.dispatch(contentsActions.deleteTool({ pageId, toolDescriptionId }));
    this.store.dispatch(toolsActions.deleteTool({ toolDescriptionId }));

    const toolType = this.toolDescription.type;

    switch (toolType) {
      case ToolNames.TEXT:
      case ToolNames.VIDEO:
      case ToolNames.CHART:
        this.deleteSingleRelatedStorageUnit(this.toolDescription, toolType);
        break;
      default:
        this.deleteMultipleRelatedStorageUnits(this.toolDescription, toolType);
    }
  }

  deleteSingleRelatedStorageUnit(toolDescription: ToolDescription, toolType: ToolNames) {
    const storageUnitDescriptionId = toolDescription.content;
    const typeCheck = this.checksService.isString(storageUnitDescriptionId);
    if (!typeCheck) return;
    switch (toolType) {
      case ToolNames.TEXT:
        this.storageUnitsService.deleteTextToolStorageUnit(storageUnitDescriptionId);
        break;
      case ToolNames.VIDEO:
        this.storageUnitsService.deleteRelatedVideoStorageUnit(storageUnitDescriptionId);
        break;
      case ToolNames.CHART:
        this.storageUnitsService.deleteRelatedChartStorageUnit(storageUnitDescriptionId);
        break;
    }
  }

  deleteMultipleRelatedStorageUnits(toolDescription: ToolDescription, toolType: ToolNames) {
    const fileDescriptionIds = toolDescription.content;
    const typeCheck = this.checksService.isNonEmptyArrayOfStrings(fileDescriptionIds);
    if (!typeCheck) return;
    switch (toolType) {
      case ToolNames.COLLAGE:
        this.storageUnitsService.deleteAllCollageImages(fileDescriptionIds);
        break;
      case ToolNames.PDF:
        this.storageUnitsService.deleteAllRelatedPDFs(fileDescriptionIds);
        break;
      case ToolNames.AUDIO:
        this.storageUnitsService.deleteAllRelatedAudios(fileDescriptionIds);
        break;
    }
  }

  openDeleteDialog() {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['delete-tool-dialog'],
      ModalWindowsText.DELETE_TOOL,
      15
    );
    const dialogRef = this.dialog.open(ConfirmActionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((positiveAnswer) => {
      if (positiveAnswer) this.delete(true);
    });
  }

  getNotification() {
    this.delete();
  }
}
