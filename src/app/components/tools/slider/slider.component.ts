import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Input() toolDescriptionId: string | null = null;
  @Output('notify') deleteTheToolSinceItsEmpty = new EventEmitter<string>();

  isGlobalEditOn: boolean = true;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: GalleryItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.images = [
      new ImageItem({
        src: 'assets/tempFiles/saladin06__sized.jpg',
        thumb: 'assets/tempFiles/saladin06__sized.jpg',
      }),
      new ImageItem({
        src: 'assets/tempFiles/1200x1200bb.jpg',
        thumb: 'assets/tempFiles/1200x1200bb.jpg',
      }),
      new ImageItem({
        src: 'assets/tempFiles/saladin06__sized.jpg',
        thumb: 'assets/tempFiles/saladin06__sized.jpg',
      }),
      new ImageItem({
        src: 'assets/tempFiles/1200x1200bb.jpg',
        thumb: 'assets/tempFiles/1200x1200bb.jpg',
      }),
      new ImageItem({
        src: 'assets/tempFiles/saladin06__sized.jpg',
        thumb: 'assets/tempFiles/saladin06__sized.jpg',
      }),
      new ImageItem({
        src: 'assets/tempFiles/1200x1200bb.jpg',
        thumb: 'assets/tempFiles/1200x1200bb.jpg',
      }),
    ];
  }
}
