import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-enter-name',
  templateUrl: './enter-name.component.html',
  styleUrls: ['./enter-name.component.scss'],
})
export class EnterNameComponent {
  pageName: string = '';

  @HostListener('document:keydown.enter')
  onEnter() {
    this.dialogRef.close(this.pageName);
  }

  constructor(
    public dialogRef: MatDialogRef<EnterNameComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogRefData: String
  ) {}
}
