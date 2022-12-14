import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FlexboxFlowOptions, FlexboxPositioningOptions, ToolNames } from 'src/constants/constants';
import { filesActions } from 'src/redux/actions/files.actions';
import { getMultipleFiles } from 'src/redux/selectors/files.selectors';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ChooseFileComponent } from '../../modals/choose-file/choose-file.component';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { StorageUnitsService } from 'src/app/services/storage-units.service';
import { ChecksService } from 'src/app/services/checks.service';
import { CollageToolDescription } from 'src/constants/models/tools';
import { FileDescriptionId, ImageFileDescription } from 'src/constants/models/files';
import { _fetchFiles, _fetchToolDescription } from '../common';

@Component({
  selector: 'app-collage',
  templateUrl: './collage.component.html',
  styleUrls: ['./collage.component.scss'],
})
export class CollageComponent implements OnDestroy, OnInit {
  @Input() toolDescriptionId: string | null = null;
  @Output('notify') deleteTheTool = new EventEmitter<string>();

  isGlobalEditOn: boolean = true;
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentlyInFullscreen$: BehaviorSubject<boolean> = this.stateService.currentlyInFullscreen$;

  toolDescription: CollageToolDescription | null = null;
  images: ImageFileDescription[] = [];
  areControlsVisible: boolean = true;
  flow = FlexboxFlowOptions;
  positioning = FlexboxPositioningOptions;
  currentPicIndex: number = -1;
  currentPicWidth: number = 0;

  picSizeUpdate = new Subject<string>();

  fetchToolDescription = _fetchToolDescription;
  fetchFiles = _fetchFiles;
  fileFetcher = getMultipleFiles;

  descriptionTypeCheck = this.checksService.isValidCollageToolDescription;
  contentsTypeCheck = this.checksService.isNonEmptyArrayOfStrings;
  filesTypeCheck = this.checksService.isValidImageFileDescriptionArray;

  constructor(
    private store: Store,
    private utilsService: UtilsService,
    private stateService: StateService,
    private storageUnitsService: StorageUnitsService,
    private dialog: MatDialog,
    private checksService: ChecksService
  ) {
    this.picSizeUpdate
      .pipe(debounceTime(500), distinctUntilChanged())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizePic();
      });
  }

  ngOnInit(): void {
    this.fetchToolDescription()
      .pipe(
        switchMap((fetchedDescription: CollageToolDescription) => {
          this.toolDescription = fetchedDescription;
          return this.fetchFiles(fetchedDescription.content, ToolNames.COLLAGE);
        }),
        switchMap((files: ImageFileDescription[]) => files)
      )
      .subscribe((files: ImageFileDescription[]) => {
        this.images = files;
      });

    this.isGlobalEditOnSub();
  }

  isGlobalEditOnSub() {
    this.stateService.isGlobalEditOn$
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.isGlobalEditOn = state;
        if (state === false) this.currentPicIndex = -1;
      });
  }

  saveLayoutChanges() {
    if (this.toolDescription)
      this.store.dispatch(
        toolsActions.updateCollageToolLayout({
          collageToolId: this.toolDescription.id,
          newJustifyContent: this.toolDescription.currentJustifyContent,
          newAlignItems: this.toolDescription.currentAlignItems,
          newFlow: this.toolDescription.currentFlow,
        })
      );
  }

  openDialogToChooseFiles() {
    const dialogConfig = this.utilsService.createMatDialogConfig(
      ['choose-file-dialog'],
      ToolNames.COLLAGE,
      15
    );
    const dialogRef = this.dialog.open(ChooseFileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((fileNames: string[]) => {
      if (fileNames) this.addImages(fileNames);
    });
  }

  addImages(fileNames: string[]) {
    if (this.toolDescription) {
      const toolDescriptionId = this.toolDescription.id;
      const { filesDescriptions, fileDescriptionIds } =
        this.storageUnitsService.createImageDescriptions(fileNames);

      this.store.dispatch(filesActions.insertNewImageFilesDescriptions({ filesDescriptions }));
      this.store.dispatch(
        toolsActions.insertNewImagesInCollage({
          toolDescriptionId,
          fileDescriptionIds,
        })
      );
    }
  }

  resizePic() {
    const imageDescription = this.images[this.currentPicIndex];
    const imageDescriptionId = imageDescription.id;
    const newWidth = this.currentPicWidth > 20 ? this.currentPicIndex : 20;
    this.store.dispatch(filesActions.updateImageWidth({ imageDescriptionId, newWidth }));
  }

  deletePic() {
    if (this.toolDescription) {
      const toolDescriptionId = this.toolDescription.id;
      const fileDescriptionId = this.images[this.currentPicIndex].id;

      this.store.dispatch(
        toolsActions.deleteImageFromCollage({
          toolDescriptionId,
          fileDescriptionId,
        })
      );
      this.store.dispatch(filesActions.deleteImage({ fileDescriptionId }));

      this.currentPicIndex = -1;
    }
  }

  moveImage(whereTo: 'left' | 'right') {
    if (this.toolDescription) {
      const oldContents = this.toolDescription.content as FileDescriptionId[];
      const selectedImageId = oldContents[this.currentPicIndex];
      const newIndex =
        whereTo === 'left' ? (this.currentPicIndex -= 1) : (this.currentPicIndex += 1);
      const newContents = this.utilsService.moveInArray(oldContents, newIndex, selectedImageId);
      this.store.dispatch(
        toolsActions.updateTextToolContents({
          toolDescriptionId: this.toolDescription.id,
          newContents,
        })
      );
    }
  }

  setPicControls(index: number, imageWidth: number) {
    if (!this.isGlobalEditOn) return;
    if (this.currentPicIndex === index) {
      //Timeout automatically launches angular change detection
      setTimeout(() => (this.currentPicIndex = -1), 0);
    } else {
      this.currentPicIndex = index;
      this.currentPicWidth = imageWidth;
    }
  }

  getPicWidth(width: number) {
    return width + 'px';
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  showInfo() {
    this.utilsService.openSnackBar(
      `???????????? ???????????????????? ???? ??????????????????, ?????? ?????????????????? ?????????????????? ?????????????????? ??????????????????????????.
      ?????? ???????????????? ???????????????????? ?????????????????? ?? ?????? ?????????????????? ?? ?????? ??????????????????????.`,
      10000,
      '??????????????'
    );
  }
}
