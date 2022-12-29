import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObservableInput, Subject, switchMap } from 'rxjs';
import { ChartTypes, ToolNames } from 'src/constants/constants';
import { getSingleFile } from 'src/redux/selectors/files.selectors';
import { filesActions } from 'src/redux/actions/files.actions';
import { ChecksService } from 'src/app/services/checks.service';
import { ChartDescription, JSONString } from 'src/constants/models/charts';
import { _fetchFiles, _fetchToolDescription } from '../common';
import { ChartToolDescription } from 'src/constants/models/tools';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() toolDescriptionId: string | null = null;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Output('notify') deleteTheTool = new EventEmitter<string>();

  chartTypes = ChartTypes;

  chartDescription: ChartDescription | null = null;

  fetchToolDescription = _fetchToolDescription;
  fetchFiles = _fetchFiles;
  fileFetcher = getSingleFile;

  descriptionTypeCheck = this.checksService.isValidBasicToolDescription;
  contentsTypeCheck = this.checksService.isString;
  filesTypeCheck = this.checksService.isValidChartDescription;

  constructor(private store: Store, private checksService: ChecksService) {}

  ngOnInit(): void {
    if (this.toolDescriptionId) {
      this.fetchToolDescription()
        .pipe(
          switchMap((fetchedDescription: ChartToolDescription) => {
            return this.fetchFiles(fetchedDescription.content, ToolNames.CHART);
          }),
          switchMap((res: ObservableInput<ChartDescription>) => res)
        )
        .subscribe((description: ChartDescription) => {
          this.chartDescription = description;
        });
    }
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
