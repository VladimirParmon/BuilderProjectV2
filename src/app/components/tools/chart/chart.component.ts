import { ChartDescription } from 'src/constants/models';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, Subject, takeUntil, switchMap } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ChartTypes, ToolNames } from 'src/constants/constants';
import { getSingleFile } from 'src/redux/selectors/files.selectors';
import { selectToolDescription } from 'src/redux/selectors/tools.selectors';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() toolDescriptionId: string | null = null;
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  destroy$: Subject<boolean> = new Subject<boolean>();

  chartTypes = ChartTypes;

  chartDescription: ChartDescription | null = null;

  constructor(
    private stateService: StateService,
    private store: Store,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.store
        .select(selectToolDescription(this.toolDescriptionId))
        .pipe(
          takeUntil(this.destroy$),
          filter(this.utilsService.isDefined),
          filter((fetchedDescription) =>
            this.utilsService.isBasicToolDescription(fetchedDescription)
          ),
          switchMap((fetchedDescription) => {
            const chartDescriptionId = fetchedDescription.content as string;
            return this.fetchChartData(chartDescriptionId);
          })
        )
        .subscribe();
    }
  }

  async fetchChartData(id: string) {
    return this.store
      .select(getSingleFile({ id, type: ToolNames.CHART }))
      .pipe(takeUntil(this.destroy$))
      .subscribe((chartDescription) => {
        if (chartDescription) {
          if (this.utilsService.isChartDescription(chartDescription))
            this.chartDescription = chartDescription;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
