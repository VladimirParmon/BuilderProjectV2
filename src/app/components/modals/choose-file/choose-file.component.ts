import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { inputTypes, ToolNames } from 'src/constants/models';

@Component({
  selector: 'app-choose-file',
  templateUrl: './choose-file.component.html',
  styleUrls: ['./choose-file.component.scss'],
})
export class ChooseFileComponent {
  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<string>,
    public utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public dialogRefData: ToolNames
  ) {}

  files: File[] = [];

  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(eventTarget: any) {
    this.prepareFilesList(eventTarget.files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
    }
  }

  async submitFiles() {
    let promises: Promise<string>[] = [];
    for (let item of this.files) {
      const promise = new Promise<string>((resolve) => {
        const file: File = item;
        const formData = new FormData();
        formData.append('my_file', file);
        this.http
          .post('http://127.0.0.1:3000/upload', formData)
          .subscribe(() => {
            resolve(item.name);
          });
      });
      promises.push(promise);
    }
    const result = await Promise.all(promises);
    this.dialogRef.close(result);
  }

  getFileTypes() {
    switch (this.dialogRefData) {
      case ToolNames.SLIDER:
      case ToolNames.COLLAGE:
        return inputTypes.IMAGES;
      case ToolNames.AUDIO:
        return inputTypes.AUDIO;
      case ToolNames.PDF:
        return inputTypes.PDF;
      case ToolNames.VIDEO:
        return inputTypes.VIDEO;
      default:
        return '';
    }
  }

  isMultipleAllowed() {
    switch (this.dialogRefData) {
      //case ToolNames.PRESENTATION:
      case ToolNames.VIDEO:
        return false;
      default:
        return true;
    }
  }
}
