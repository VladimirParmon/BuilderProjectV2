import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ToolNames } from 'src/constants/constants';

import { toolsActions } from 'src/redux/actions/tools.actions';
import { getMultipleFiles } from 'src/redux/selectors/files.selectors';
import { ChooseFileComponent } from '../../modals/choose-file/choose-file.component';
import { filesActions } from 'src/redux/actions/files.actions';
import { StorageUnitsService } from 'src/app/services/storage-units.service';
import { ChecksService } from 'src/app/services/checks.service';
import { PDFToolDescription, ToolDescriptionId } from 'src/constants/models/tools';
import { PDFFileDescription } from 'src/constants/models/files';
import { _fetchFiles, _fetchToolDescription } from '../common';

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

  fetchToolDescription = _fetchToolDescription;
  fetchFiles = _fetchFiles;
  isDefined = this.checksService.isDefined;
  descriptionTypeCheck = this.checksService.isValidBasicToolDescription;
  contentsTypeCheck = this.checksService.isNonEmptyArrayOfStrings;
  filesTypeCheck = this.checksService.isBasicFileDescriptionArray;
  fileFetcher = getMultipleFiles;

  constructor(
    private stateService: StateService,
    private store: Store,
    private utilsService: UtilsService,
    private storageUnitsService: StorageUnitsService,
    private dialog: MatDialog,
    private checksService: ChecksService
  ) {}

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.fetchToolDescription()
        .pipe(
          switchMap((fetchedDescription: PDFToolDescription) => {
            this.PDFFilesIds = fetchedDescription.content;
            return this.fetchFiles(this.PDFFilesIds, ToolNames.PDF);
          }),
          switchMap((files: PDFFileDescription[]) => files)
        )
        .subscribe((files: PDFFileDescription[]) => {
          this.PDFFiles = files;
        });
    }
  }

  getName(filePath: string) {
    return this.utilsService.getFileNameNoExtension(filePath, ToolNames.PDF);
  }

  addPDF(fileNames: string[]) {
    if (this.PDFFilesIds && this.toolDescriptionId) {
      const toolDescriptionId = this.toolDescriptionId;
      const { filesDescriptions, fileDescriptionIds } =
        this.storageUnitsService.createPDFDescriptions(fileNames);

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
