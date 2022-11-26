import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, Subject, takeUntil, switchMap } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ToolService } from 'src/app/services/tool.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ToolNames } from 'src/constants/constants';
import { AudioFileDescription, ToolDescriptionId } from 'src/constants/models';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { getMultipleFiles } from 'src/redux/selectors/files.selectors';
import { ChooseFileComponent } from '../../modals/choose-file/choose-file.component';
import { filesActions } from 'src/redux/actions/files.actions';
import { selectToolDescription } from 'src/redux/selectors/tools.selectors';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit, OnDestroy {
  @Input() toolDescriptionId: ToolDescriptionId | null = null;
  @Output('notify') deleteTheToolSinceItsEmpty = new EventEmitter<string>();

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  destroy$: Subject<boolean> = new Subject<boolean>();

  audioFilesIds: string[] | null = null;
  audioFiles: AudioFileDescription[] = [];

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
            this.audioFilesIds = arrayOfIds;
            return this.fetchAudios(arrayOfIds);
          })
        )
        .subscribe();
    }
  }

  async fetchAudios(ids: string[]) {
    return this.store
      .select(getMultipleFiles({ ids, type: ToolNames.AUDIO }))
      .pipe(takeUntil(this.destroy$))
      .subscribe((files) => {
        const isNotEmpty = files.length > 0;
        if (isNotEmpty) {
          if (this.utilsService.isBasicFileDescriptionArray(files)) this.audioFiles = files;
        } else {
          this.deleteTheToolSinceItsEmpty.emit('this tool is empty, please delete it');
        }
      });
  }

  getName(filePath: string) {
    const strippedName = this.utilsService.getFileName(filePath);
    const noExtension = this.utilsService.removeFileExtension(strippedName, ToolNames.AUDIO);
    if (strippedName.length > 50) return noExtension.slice(0, 50) + '...';
    return noExtension;
  }

  addAudio(fileNames: string[]) {
    if (this.audioFilesIds && this.toolDescriptionId) {
      const toolDescriptionId = this.toolDescriptionId;
      const { filesDescriptions, fileDescriptionIds } =
        this.toolService.createAudioDescriptions(fileNames);

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
      ToolNames.PDF,
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
