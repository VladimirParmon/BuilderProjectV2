import { Component, Input, OnInit } from '@angular/core';
import { standardChartColors } from 'src/constants/constants';
import { NonCompoundChartResults } from 'src/constants/models/charts';

@Component({
  selector: 'app-custom-legend',
  templateUrl: './custom-legend.component.html',
  styleUrls: ['./custom-legend.component.scss'],
})
export class CustomLegendComponent implements OnInit {
  @Input() chartResults: NonCompoundChartResults[] | null = null;

  colors = standardChartColors;

  constructor() {}

  ngOnInit(): void {}
}
