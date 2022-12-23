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
import { BarChartData, JSONString } from 'src/constants/models';
import { debounceTime } from 'rxjs/operators';
import { _addEntry, _deleteEntry, _dispatchToParent, _handleSizeChange } from '../common';

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

  inputDebounce = new Subject<unknown>();
  destroy$ = new Subject<boolean>();

  handleSizeChange = _handleSizeChange;
  addEntry = _addEntry;
  deleteEntry = _deleteEntry;
  dispatchToParent = _dispatchToParent;

  constructor(private stateService: StateService, public utilsService: UtilsService) {
    this.inputDebounce
      .pipe(debounceTime(200))
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
