import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, Subject, takeUntil, switchMap } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ToolService } from 'src/app/services/tool.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ToolNames } from 'src/constants/constants';
import { PDFFileDescription, ToolDescriptionId } from 'src/constants/models';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { getMultipleFiles } from 'src/redux/selectors/files.selectors';
import { ChooseFileComponent } from '../../modals/choose-file/choose-file.component';
import { filesActions } from 'src/redux/actions/files.actions';
import { selectToolDescription } from 'src/redux/selectors/tools.selectors';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
})
export class PDFComponent implements OnInit, OnDestroy {
  @Input() toolDescriptionId: ToolDescriptionId | null = null;
  @Output('notify') deleteTheToolSinceItsEmpty = new EventEmitter<string>();

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  destroy$: Subject<boolean> = new Subject<boolean>();

  PDFFilesIds: string[] | null = null;
  PDFFiles: PDFFileDescription[] = [];

  constructor(
    private stateService: StateService,
    private store: Store,
    private utilsService: UtilsService,
    private toolService: ToolService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.store
        .select(selectToolDescription(this.toolDescriptionId))
        .pipe(
          takeUntil(this.destroy$),
          filter(this.utilsService.isDefined),
          filter((fetchedDescription) =>
            this.utilsService.isBasicToolDescription(fetchedDescription)
          ),
          switchMap((fetchedDescription) => {
            const arrayOfIds = fetchedDescription.content as string[];
            this.PDFFilesIds = arrayOfIds;
            return this.fetchPDFs(arrayOfIds);
          })
        )
        .subscribe();
    }
  }

  async fetchPDFs(ids: string[]) {
    return this.store
      .select(getMultipleFiles({ ids, type: ToolNames.PDF }))
      .pipe(takeUntil(this.destroy$))
      .subscribe((files) => {
        const isNotEmpty = files.length > 0;
        if (isNotEmpty) {
          if (this.utilsService.isBasicFileDescriptionArray(files)) this.PDFFiles = files;
        } else {
          this.deleteTheToolSinceItsEmpty.emit('this tool is empty, please delete it');
        }
      });
  }

  getName(filePath: string) {
    const strippedName = this.utilsService.getFileName(filePath);
    const noPDFExtension = strippedName.replace(/.pdf/i, '');
    if (strippedName.length > 50) return noPDFExtension.slice(0, 50) + '...';
    return noPDFExtension;
  }

  addPDF(fileNames: string[]) {
    if (this.PDFFilesIds && this.toolDescriptionId) {
      const toolDescriptionId = this.toolDescriptionId;
      const { filesDescriptions, fileDescriptionIds } =
        this.toolService.createPDFDescriptions(fileNames);

      this.store.dispatch(filesActions.insertNewPDFFilesDescriptions({ filesDescriptions }));
      this.store.dispatch(
        toolsActions.addNewContentsToPDF({ toolDescriptionId, fileDescriptionIds })
      );
    }
  }

  deletePDF(index: number) {
    if (this.PDFFilesIds && this.toolDescriptionId) {
      const toolDescriptionId = this.toolDescriptionId;
      const fileDescriptionId = this.PDFFilesIds[index];

      this.store.dispatch(
        toolsActions.deleteFileFromPDFTool({ toolDescriptionId, fileDescriptionId })
      );
      this.store.dispatch(filesActions.deletePDF({ fileDescriptionId }));
    }
  }

  openDialogToChooseFiles() {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['choose-file-dialog'],
      ToolNames.PDF,
      15
    );
    const dialogRef = this.dialog.open(ChooseFileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((fileNames: string[]) => {
      if (fileNames) this.addPDF(fileNames);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.PDFFilesIds && this.toolDescriptionId) {
      const toolDescriptionId = this.toolDescriptionId;
      const array = this.utilsService.arrayDeepCopy(this.PDFFilesIds);
      const from = event.previousIndex;
      const to = event.currentIndex;
      moveItemInArray(array, from, to);
      this.store.dispatch(
        toolsActions.updatePDFToolContents({ toolDescriptionId, newContents: array })
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
