import { ChartDescription, JSONString } from 'src/constants/models';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil, switchMap } from 'rxjs';
import { ChartTypes, ToolNames } from 'src/constants/constants';
import { getSingleFile } from 'src/redux/selectors/files.selectors';
import { selectToolDescription } from 'src/redux/selectors/tools.selectors';
import { filesActions } from 'src/redux/actions/files.actions';
import { ChecksService } from 'src/app/services/checks.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() toolDescriptionId: string | null = null;
  destroy$: Subject<boolean> = new Subject<boolean>();

  chartTypes = ChartTypes;

  chartDescription: ChartDescription | null = null;

  constructor(private store: Store, private checksService: ChecksService) {}

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.store
        .select(selectToolDescription(this.toolDescriptionId))
        .pipe(
          takeUntil(this.destroy$),
          filter(this.checksService.isDefined),
          filter((fetchedDescription) =>
            this.checksService.isBasicToolDescription(fetchedDescription)
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
          if (this.checksService.isChartDescription(chartDescription))
            this.chartDescription = { ...chartDescription };
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  handleChanges(data: JSONString) {
    if (this.toolDescriptionId && this.chartDescription) {
      this.store.dispatch(
        filesActions.updateChart({ fileDescriptionId: this.chartDescription.id, newData: data })
      );
    }
  }
}
