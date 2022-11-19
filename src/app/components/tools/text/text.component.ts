import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { TextDescription, ToolDescriptionContent } from 'src/constants/models';
import { getSingleFile } from 'src/redux/selectors';
import { ToolNames } from 'src/constants/constants';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Input() toolContent: ToolDescriptionContent | null = null;
  textFileId: string | null = null;
  destroy$: Subject<boolean> = new Subject<boolean>();
  textToDisplay: string | null = null;

  constructor(public store: Store, private utilsService: UtilsService) {}

  ngOnInit(): void {
    if (this.toolContent) {
      if (this.utilsService.isString(this.toolContent)) {
        this.textFileId = this.toolContent;
      }
    }
    if (this.textFileId) {
      this.store
        .select(getSingleFile({ id: this.textFileId, type: ToolNames.TEXT }))
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          const textDescription = data as TextDescription;
          if (textDescription) this.textToDisplay = textDescription.text;
        });
    }
  }
}
