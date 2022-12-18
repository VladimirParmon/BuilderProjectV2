import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ToolNames } from 'src/constants/constants';
import {
  FileDescriptionId,
  ToolDescriptionContent,
  VideoFileDescription,
} from 'src/constants/models';
import { getSingleFile } from 'src/redux/selectors/files.selectors';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {
  @Input() fileDescriptionId: ToolDescriptionContent | null = null;
  destroy$: Subject<boolean> = new Subject<boolean>();
  video: VideoFileDescription | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    if (this.fileDescriptionId) {
      const x = this.fileDescriptionId as FileDescriptionId;
      this.store
        .select(getSingleFile({ id: x, type: ToolNames.VIDEO }))
        .pipe(takeUntil(this.destroy$))
        .subscribe((fetchedDescription) => {
          if (fetchedDescription) this.video = fetchedDescription as VideoFileDescription;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
