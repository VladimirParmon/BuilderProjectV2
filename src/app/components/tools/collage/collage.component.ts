import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, EMPTY, Subject, takeUntil } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FlexboxFlowOptions, FlexboxPositioningOptions, ToolNames } from 'src/constants/constants';
import {
  CollageToolDescription,
  FileDescriptionId,
  ImageFileDescription,
} from 'src/constants/models';
import { filesActions } from 'src/redux/actions/files.actions';
import { getMultipleFiles } from 'src/redux/selectors/files.selectors';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ChooseFileComponent } from '../../modals/choose-file/choose-file.component';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { ToolService } from 'src/app/services/tool.service';
import { selectToolDescription } from 'src/redux/selectors/tools.selectors';
import { FullscreenService } from 'src/app/services/fullscreen.service';

@Component({
  selector: 'app-collage',
  templateUrl: './collage.component.html',
  styleUrls: ['./collage.component.scss'],
})
export class CollageComponent implements OnDestroy, OnInit {
  @Input() toolDescriptionId: string | null = null;
  @Output('notify') deleteTheToolSinceItsEmpty = new EventEmitter<string>();

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

  constructor(
    private store: Store,
    private utilsService: UtilsService,
    private stateService: StateService,
    private toolService: ToolService,
    private dialog: MatDialog
  ) {
    this.picSizeUpdate
      .pipe(debounceTime(500), distinctUntilChanged())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizePic();
      });
  }

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.store
        .select(selectToolDescription(this.toolDescriptionId))
        .pipe(
          takeUntil(this.destroy$),
          filter(this.utilsService.isDefined),
          filter((fetchedDescription) =>
            this.utilsService.isCollageToolDescription(fetchedDescription)
          ),
          tap((fetchedDescription) => {
            this.toolDescription = { ...fetchedDescription } as CollageToolDescription;
          }),
          switchMap((fetchedDescription) => {
            const arrayOfIds = fetchedDescription.content as string[];
            if (this.utilsService.isNonEmptyArrayOfStrings(arrayOfIds)) {
              return this.fetchPics(arrayOfIds);
            } else {
              return EMPTY;
            }
          })
        )
        .subscribe();
    }

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

  async fetchPics(arrayOfIds: string[]) {
    return this.store
      .select(getMultipleFiles({ ids: arrayOfIds, type: ToolNames.COLLAGE }))
      .pipe(takeUntil(this.destroy$))
      .subscribe((pics) => {
        if (pics) {
          if (this.utilsService.isImageFileDescriptionArray(pics)) this.images = [...pics];
        } else {
          this.destroy$.next(true);
          this.deleteTheToolSinceItsEmpty.emit('this tool is empty, please delete it');
        }
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
        this.toolService.createImageDescriptions(fileNames);

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
    const newWidth = this.currentPicWidth;
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
        toolsActions.updateToolContents({
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
      `Ручное сохранение не требуется, все изменения компонент сохраняет автоматически.
      При удалении компонента удаляются и все связанные с ним изображения.`,
      10000,
      'Понятно'
    );
  }
}
