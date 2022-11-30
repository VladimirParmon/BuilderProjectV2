import { GalleryItem, GalleryState, ImageItem } from 'ng-gallery';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, EMPTY, Subject, takeUntil } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ToolNames } from 'src/constants/constants';
import { FileDescriptionId, ImageFileDescription } from 'src/constants/models';
import { filesActions } from 'src/redux/actions/files.actions';
import { getMultipleFiles } from 'src/redux/selectors/files.selectors';
import { filter, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ChooseFileComponent } from '../../modals/choose-file/choose-file.component';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { ToolService } from 'src/app/services/tool.service';
import { selectToolDescription } from 'src/redux/selectors/tools.selectors';
import { FullscreenService } from 'src/app/services/fullscreen.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Gallery, GalleryRef } from 'ng-gallery';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  animations: [
    trigger('animate', [
      transition('void => true', [style({ width: '0' }), animate(100, style({ width: '*' }))]),
    ]),
  ],
})
export class SliderComponent implements OnInit, OnDestroy {
  @Input() toolDescriptionId: string | null = null;
  @Output('notify') deleteTheToolSinceItsEmpty = new EventEmitter<string>();

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  currentlyInFullscreen$: BehaviorSubject<boolean> = this.stateService.currentlyInFullscreen$;
  destroy$: Subject<boolean> = new Subject<boolean>();

  galleryRef: GalleryRef | null = null;

  images: GalleryItem[] = [];
  imagesIds: FileDescriptionId[] = [];
  currentIndex: number = 0;
  newInsertionIndexForAnimation: number = -1;

  constructor(
    private store: Store,
    private utilsService: UtilsService,
    private stateService: StateService,
    private toolService: ToolService,
    private fullscreenService: FullscreenService,
    private dialog: MatDialog,
    private gallery: Gallery
  ) {}

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.galleryRef = this.gallery.ref(this.toolDescriptionId);
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
            if (this.utilsService.isNonEmptyArrayOfStrings(arrayOfIds)) {
              this.imagesIds = [...arrayOfIds];
              return this.fetchImages(arrayOfIds);
            } else {
              return EMPTY;
            }
          })
        )
        .subscribe();
    }
  }

  async fetchImages(arrayOfIds: string[]) {
    return this.store
      .select(getMultipleFiles({ ids: arrayOfIds, type: ToolNames.SLIDER }))
      .pipe(takeUntil(this.destroy$))
      .subscribe((images) => {
        if (images) {
          if (this.utilsService.isImageFileDescriptionArray(images)) {
            this.images = this.transformToGalleryItem(images);
          }
        } else {
          this.destroy$.next(true);
          this.deleteTheToolSinceItsEmpty.emit('this tool is empty, please delete it');
        }
      });
  }

  transformToGalleryItem(images: ImageFileDescription[]) {
    return images.map(
      (i) =>
        new ImageItem({
          src: i.pathToFile,
          thumb: i.pathToFile,
        })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  drop(event: CdkDragDrop<any>) {
    this.newInsertionIndexForAnimation = event.currentIndex;
    moveItemInArray(this.imagesIds, event.previousIndex, event.currentIndex);

    if (this.toolDescriptionId) {
      const toolDescriptionId = this.toolDescriptionId;
      const newContents = this.imagesIds;
      this.store.dispatch(
        toolsActions.updateSliderToolContents({ toolDescriptionId, newContents })
      );
    }
  }

  indexChangeHandler(event: GalleryState) {
    if (event.currIndex !== undefined) this.currentIndex = event.currIndex;
  }

  setImage(index: number) {
    this.galleryRef?.set(index);
  }
}
