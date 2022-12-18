import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';
import { BarChartData, JSONString, NonCompoundChartResults } from 'src/constants/models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Defaults } from 'src/app/services/defaults';

@Component({
  selector: 'app-bar-vertical',
  templateUrl: './bar-vertical.component.html',
  styleUrls: ['./bar-vertical.component.scss'],
})
export class BarVerticalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chartDataJSONString: JSONString = '';
  @Input() isExample: true | undefined;
  @Output('dispatch-changes') dispatch = new EventEmitter<JSONString>();

  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  chartData: BarChartData | null = null;

  inputDebounce = new Subject();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private stateService: StateService, private utilsService: UtilsService) {
    this.inputDebounce
      .pipe(debounceTime(500), distinctUntilChanged())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dispatchToParent();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newValue = changes['chartDataJSONString'].currentValue;
    if (this.chartData) this.chartData.results = JSON.parse(newValue).results;
  }

  ngOnInit(): void {
    if (this.chartDataJSONString) {
      this.chartData = JSON.parse(this.chartDataJSONString);
    }
  }

  handleSizeChange(event: Event, isWidth: boolean) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);
    value = value >= Defaults.minGraphSize ? value : Defaults.minGraphSize;
    value = value <= Defaults.maxGraphSize ? value : Defaults.maxGraphSize;
    if (this.chartData) {
      const oldWidth = this.chartData.view[0];
      const oldHeight = this.chartData.view[1];
      const newSizes: [number, number] = isWidth ? [value, oldHeight] : [oldWidth, value];
      this.chartData = { ...this.chartData, view: newSizes };
    }
    this.inputDebounce.next(true);
  }

  drop(event: CdkDragDrop<NonCompoundChartResults[]>) {
    if (this.chartData) {
      const from = event.previousIndex;
      const to = event.currentIndex;
      const array = this.utilsService.arrayDeepCopy(this.chartData.results);
      moveItemInArray(array, from, to);
      this.dispatchToParent(array);
    }
  }

  deleteEntry(entryName: string) {
    if (this.chartData) {
      const array = this.utilsService
        .arrayDeepCopy(this.chartData.results)
        .filter((e) => e.name !== entryName);
      this.dispatchToParent(array);
    }
  }

  addEntry() {
    if (this.chartData) {
      const array = this.utilsService.arrayDeepCopy(this.chartData.results);
      array.push({
        name: `Новое поле ${array.length + 1}`,
        value: 0,
      });
      this.dispatchToParent(array);
    }
  }

  dispatchToParent(array?: NonCompoundChartResults[]) {
    const newData = JSON.stringify({
      ...this.chartData,
      results: array || this.chartData?.results,
    });
    this.dispatch.emit(newData);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
