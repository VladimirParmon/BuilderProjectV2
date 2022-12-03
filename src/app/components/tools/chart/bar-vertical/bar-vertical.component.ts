import { Component, Input, OnInit } from '@angular/core';
import { BarChartData, JSONString } from 'src/constants/models';

@Component({
  selector: 'app-bar-vertical',
  templateUrl: './bar-vertical.component.html',
  styleUrls: ['./bar-vertical.component.scss'],
})
export class BarVerticalComponent implements OnInit {
  @Input() chartDataJSONString: JSONString = '';
  chartData: BarChartData | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.chartDataJSONString) {
      this.chartData = JSON.parse(this.chartDataJSONString);
    }
  }
}
