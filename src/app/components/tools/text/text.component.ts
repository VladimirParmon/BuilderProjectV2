import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import Quill from 'quill';
import { Store } from '@ngrx/store';
import { BehaviorSubject, ObservableInput, Subject, switchMap } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { getSingleFile } from 'src/redux/selectors/files.selectors';
import { fontFamilies, fontSizes, ToolNames } from 'src/constants/constants';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StateService } from 'src/app/services/state.service';
import { QuillModules } from 'ngx-quill';
import { filesActions } from 'src/redux/actions/files.actions';
import { ChecksService } from 'src/app/services/checks.service';
import { TextToolDescription, ToolDescriptionContent } from 'src/constants/models/tools';
import { TextDescription } from 'src/constants/models/files';
import { _fetchFiles, _fetchToolDescription } from '../common';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit, OnDestroy {
  @Input() toolDescriptionId: ToolDescriptionContent | null = null;
  textFileId: string | null = null;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  isToolbarHidden: boolean = false;
  @Output('notify') deleteTheTool = new EventEmitter<string>();

  constructor(
    public store: Store,
    public stateService: StateService,
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private checksService: ChecksService
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

  fetchToolDescription = _fetchToolDescription;
  fetchFiles = _fetchFiles;
  fileFetcher = getSingleFile;

  descriptionTypeCheck = this.checksService.isValidBasicToolDescription;
  contentsTypeCheck = this.checksService.isString;
  filesTypeCheck = this.checksService.isValidTextDescription;

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.fetchToolDescription()
        .pipe(
          switchMap((fetchedDescription: TextToolDescription) => {
            this.textFileId = fetchedDescription.content;
            return this.fetchFiles(this.textFileId, ToolNames.TEXT);
          }),
          switchMap((description: ObservableInput<TextDescription>) => description)
        )
        .subscribe((description: TextDescription) => {
          this.quillForm.setValue({ html: description.text });
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
      this.utilsService.openSnackBar('Текстовое поле успешно сохранено', 2000, 'Понятно');
    }
  }
}
