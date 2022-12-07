import { Component, Input, OnInit } from '@angular/core';
import { JSONString, PieChartData } from 'src/constants/models';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
})
export class PieComponent implements OnInit {
  @Input() chartDataJSONString: JSONString = '';
  chartData: PieChartData | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.chartDataJSONString) {
      this.chartData = JSON.parse(this.chartDataJSONString);
    }
  }
}
