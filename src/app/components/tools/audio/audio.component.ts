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
import { _fetchFiles, _fetchToolDescription } from '../common';
import { AudioToolDescription, ToolDescriptionId } from 'src/constants/models/tools';
import { AudioFileDescription } from 'src/constants/models/files';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit, OnDestroy {
  @Input() toolDescriptionId: ToolDescriptionId | null = null;
  @Output('notify') deleteTheTool = new EventEmitter<string>();

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  destroy$: Subject<boolean> = new Subject<boolean>();

  audioFilesIds: string[] | null = null;
  audioFiles: AudioFileDescription[] = [];

  fetchToolDescription = _fetchToolDescription;
  fetchFiles = _fetchFiles;
  fileFetcher = getMultipleFiles;

  descriptionTypeCheck = this.checksService.isValidBasicToolDescription;
  contentsTypeCheck = this.checksService.isNonEmptyArrayOfStrings;
  filesTypeCheck = this.checksService.isBasicFileDescriptionArray;

  constructor(
    private stateService: StateService,
    private store: Store,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private storageUnitsService: StorageUnitsService,
    private checksService: ChecksService
  ) {}

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.fetchToolDescription()
        .pipe(
          switchMap((fetchedDescription: AudioToolDescription) => {
            this.audioFilesIds = fetchedDescription.content;
            return this.fetchFiles(this.audioFilesIds, ToolNames.AUDIO);
          }),
          switchMap((files: AudioFileDescription[]) => files)
        )
        .subscribe((files: AudioFileDescription[]) => {
          this.audioFiles = files;
        });
    }
  }

  getName(filePath: string) {
    return this.utilsService.getFileNameNoExtension(filePath, ToolNames.AUDIO);
  }

  addAudio(fileNames: string[]) {
    if (this.audioFilesIds && this.toolDescriptionId) {
      const toolDescriptionId = this.toolDescriptionId;
      const { filesDescriptions, fileDescriptionIds } =
        this.storageUnitsService.createAudioDescriptions(fileNames);

      this.store.dispatch(filesActions.insertNewAudioFilesDescriptions({ filesDescriptions }));
      this.store.dispatch(
        toolsActions.addNewContentsToPDF({ toolDescriptionId, fileDescriptionIds })
      );
    }
  }

  deleteAudio(index: number) {
    if (this.audioFilesIds && this.toolDescriptionId) {
      const toolDescriptionId = this.toolDescriptionId;
      const fileDescriptionId = this.audioFilesIds[index];

      this.store.dispatch(
        toolsActions.deleteFileFromAudioTool({ toolDescriptionId, fileDescriptionId })
      );
      this.store.dispatch(filesActions.deleteAudio({ fileDescriptionId }));
    }
  }

  openDialogToChooseFiles() {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['choose-file-dialog'],
      ToolNames.AUDIO,
      15
    );
    const dialogRef = this.dialog.open(ChooseFileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((fileNames: string[]) => {
      if (fileNames) this.addAudio(fileNames);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.audioFilesIds && this.toolDescriptionId) {
      const toolDescriptionId = this.toolDescriptionId;
      const array = this.utilsService.arrayDeepCopy(this.audioFilesIds);
      const from = event.previousIndex;
      const to = event.currentIndex;
      moveItemInArray(array, from, to);
      this.store.dispatch(
        toolsActions.updateAudioToolContents({ toolDescriptionId, newContents: array })
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
