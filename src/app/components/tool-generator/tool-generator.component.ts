import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Junction, ModalWindowsText, ToolNames } from 'src/constants/models';
import { animate, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmActionComponent } from '../modals/confirm-action/confirm-action.component';
import { Store } from '@ngrx/store';
import { selectJunction } from 'src/redux/selectors';

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
  @Input() toolId: string = '';
  names = ToolNames;
  destroy$: Subject<boolean> = new Subject<boolean>();
  toolDescription: Junction | null = null;

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;

  constructor(
    private stateService: StateService,
    private utilsService: UtilsService,
    public dialog: MatDialog,
    public store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectJunction(this.toolId))
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
    //TODO: dispatch action to delete tool
  }

  openDeleteDialog() {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['delete-page-dialog'], //TODO: change this
      ModalWindowsText.DELETE_TOOL
    );
    const dialogRef = this.dialog.open(ConfirmActionComponent, dialogConfig);
    dialogRef
      .afterClosed()
      .subscribe((positiveAnswer) => {
        if (positiveAnswer) this.delete();
      })
      .unsubscribe();
  }
}
