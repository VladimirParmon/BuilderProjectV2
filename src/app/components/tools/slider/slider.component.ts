import { GalleryItem, GalleryState, ImageItem } from 'ng-gallery';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ToolNames } from 'src/constants/constants';
import { FileDescriptionId, ImageFileDescription } from 'src/constants/models/files';
import { getMultipleFiles } from 'src/redux/selectors/files.selectors';
import { toolsActions } from 'src/redux/actions/tools.actions';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Gallery, GalleryRef } from 'ng-gallery';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChecksService } from 'src/app/services/checks.service';
import { _fetchFiles, _fetchToolDescription } from '../common';
import { SliderToolDescription } from 'src/constants/models/tools';

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
  @Output('notify') deleteTheTool = new EventEmitter<string>();

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  currentlyInFullscreen$: BehaviorSubject<boolean> = this.stateService.currentlyInFullscreen$;
  destroy$: Subject<boolean> = new Subject<boolean>();

  galleryRef: GalleryRef | null = null;

  images: GalleryItem[] = [];
  imagesIds: FileDescriptionId[] = [];
  currentIndex: number = 0;
  newInsertionIndexForAnimation: number = -1;

  fetchToolDescription = _fetchToolDescription;
  fetchFiles = _fetchFiles;
  fileFetcher = getMultipleFiles;

  descriptionTypeCheck = this.checksService.isValidBasicToolDescription;
  contentsTypeCheck = this.checksService.isNonEmptyArrayOfStrings;
  filesTypeCheck = this.checksService.isBasicFileDescriptionArray;

  constructor(
    private store: Store,
    private stateService: StateService,
    private gallery: Gallery,
    private checksService: ChecksService
  ) {}

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.galleryRef = this.gallery.ref(this.toolDescriptionId);
      this.fetchToolDescription()
        .pipe(
          switchMap((fetchedDescription: SliderToolDescription) => {
            this.imagesIds = fetchedDescription.content;
            return this.fetchFiles(this.imagesIds, ToolNames.SLIDER);
          }),
          switchMap((files: ImageFileDescription[]) => files)
        )
        .subscribe((files: ImageFileDescription[]) => {
          this.images = this.transformToGalleryItems(files);
        });
    }
  }

  transformToGalleryItems(images: ImageFileDescription[]) {
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
