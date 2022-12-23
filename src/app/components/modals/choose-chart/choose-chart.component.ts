import { Component } from '@angular/core';
import { ChartTypes } from 'src/constants/constants';
import { MatDialogRef } from '@angular/material/dialog';
import { Defaults } from 'src/app/services/defaults';
import { JSONString } from 'src/constants/models';

@Component({
  selector: 'app-choose-chart',
  templateUrl: './choose-chart.component.html',
  styleUrls: ['./choose-chart.component.scss'],
})
export class ChooseChartComponent {
  selectedChart: ChartTypes | null = null;

  ChartTypes = ChartTypes;

  barVerticalExample: JSONString = Defaults.getChartExample(ChartTypes.BAR_VERTICAL);
  pieExample: JSONString = Defaults.getChartExample(ChartTypes.PIE);

  constructor(private dialogRef: MatDialogRef<ChooseChartComponent>) {}

  confirmChoice() {
    if (this.selectedChart) this.dialogRef.close(this.selectedChart);
  }
}
