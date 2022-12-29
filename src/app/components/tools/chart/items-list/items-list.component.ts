import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { NonCompoundChartResults } from 'src/constants/models/charts';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent {
  @Input() chartResults: NonCompoundChartResults[] | null = null;
  @Output('debounce') debounce = new EventEmitter();
  @Output('dispatch-changes') dispatchEmitter = new EventEmitter<NonCompoundChartResults[]>();
  @Output('delete-entry') deleteEmitter = new EventEmitter<string>();
  @Output('add-entry') addEmitter = new EventEmitter();

  constructor(private utilsService: UtilsService) {}

  drop(event: CdkDragDrop<NonCompoundChartResults[]>) {
    if (this.chartResults) {
      const from = event.previousIndex;
      const to = event.currentIndex;
      const array = this.utilsService.arrayDeepCopy(this.chartResults);
      moveItemInArray(array, from, to);
      this.dispatchEmitter.emit(array);
    }
  }

  inputDebounce() {
    this.debounce.emit(true);
  }

  addEntry() {
    this.addEmitter.emit();
  }

  deleteEntry(entryName: string) {
    this.deleteEmitter.emit(entryName);
  }
}
