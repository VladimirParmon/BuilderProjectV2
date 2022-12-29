import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { _addEntry, _deleteEntry, _dispatchToParent, _handleSizeChange } from '../common';
import { UtilsService } from 'src/app/services/utils.service';
import { JSONString, PieChartData } from 'src/constants/models/charts';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
})
export class PieComponent implements OnInit, OnChanges {
  @Input() chartDataJSONString: JSONString = '';
  @Input() isExample: true | undefined;
  @Output('dispatch-changes') dispatch = new EventEmitter<JSONString>();

  inputDebounce = new Subject<unknown>();
  destroy$ = new Subject<boolean>();
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;

  chartData: PieChartData | null = null;

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
}
