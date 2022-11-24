import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Quill from 'quill';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { TextDescription, ToolDescriptionContent } from 'src/constants/models';
import { getSingleFile } from 'src/redux/selectors/files.selectors';
import { fontFamilies, fontSizes, ToolNames } from 'src/constants/constants';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StateService } from 'src/app/services/state.service';
import { QuillModules } from 'ngx-quill';
import { filesActions } from 'src/redux/actions/files.actions';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit, OnDestroy {
  @Input() toolContent: ToolDescriptionContent | null = null;
  textFileId: string | null = null;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  isToolbarHidden: boolean = false;

  constructor(
    public store: Store,
    public stateService: StateService,
    private utilsService: UtilsService,
    private fb: FormBuilder
  ) {
    this.quillForm = this.fb.group({
      html: new FormControl(),
    });
  }

  modules: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // 2₂ and 2²
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }], // text direction
      [{ size: fontSizes }],
      ['code'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'], // remove formatting
      ['link'],
      [{ font: fontFamilies }],
    ],
  };

  quillForm: FormGroup;

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
          if (textDescription) {
            this.quillForm.setValue({ html: textDescription.text });
          }
        });
    }
    this.registerFontsAndSizes();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  registerFontsAndSizes() {
    const FontAttributor = Quill.import('attributors/class/font');
    FontAttributor.whitelist = fontFamilies;
    Quill.register(FontAttributor, true);
    const sizeAttributor = Quill.import('attributors/style/size');
    sizeAttributor.whitelist = fontSizes;
    Quill.register(sizeAttributor, true);
  }

  save() {
    const text = this.quillForm.get('html')?.value;
    if (this.textFileId && text) {
      this.isToolbarHidden = true;
      this.store.dispatch(
        filesActions.updateTextStorageUnit({ id: this.textFileId, newText: text })
      );
      this.utilsService.openSnackBar('Текстовое поле успешно сохранено', 'Понятно', 2000);
    }
  }
}
