import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { BehaviorSubject } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { BarChartData, JSONString } from 'src/constants/models';

@Component({
  selector: 'app-bar-vertical',
  templateUrl: './bar-vertical.component.html',
  styleUrls: ['./bar-vertical.component.scss'],
})
export class BarVerticalComponent implements OnInit {
  @Input() chartDataJSONString: JSONString = '';
  @Input() isExample: true | undefined;
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn$;
  chartData: BarChartData | null = null;
  lp: LegendPosition = LegendPosition.Below;

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    if (this.chartDataJSONString) {
      this.chartData = JSON.parse(this.chartDataJSONString);
    }
  }

  handleSizeChange(event: Event, isWidth: boolean) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (this.chartData) {
      const oldWidth = this.chartData.view[0];
      const oldHeight = this.chartData.view[1];
      const newSizes: [number, number] = isWidth ? [value, oldHeight] : [oldWidth, value];
      this.chartData = { ...this.chartData, view: newSizes };
    }
  }
}
