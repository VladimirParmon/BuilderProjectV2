import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ChecksService } from 'src/app/services/checks.service';
import { ToolDeletionMessages, ToolNames } from 'src/constants/constants';
import { FileDescriptionId, VideoFileDescription } from 'src/constants/models/files';
import { ToolDescriptionContent } from 'src/constants/models/tools';
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
  @Output('notify') deleteTheTool = new EventEmitter<string>();

  constructor(private store: Store, private checksService: ChecksService) {}

  ngOnInit(): void {
    if (this.fileDescriptionId) {
      const x = this.fileDescriptionId as FileDescriptionId;
      this.store
        .select(getSingleFile(x, ToolNames.VIDEO))
        .pipe(takeUntil(this.destroy$))
        .subscribe((fetchedDescription) => {
          if (fetchedDescription) {
            const typeCheck = this.checksService.isValidBasicFileDescription(fetchedDescription);
            if (typeCheck) {
              this.video = fetchedDescription as VideoFileDescription;
            } else {
              this.deleteTheTool.emit(ToolDeletionMessages.BROKEN);
            }
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
