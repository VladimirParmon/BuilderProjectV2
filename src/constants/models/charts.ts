import { Color, LegendPosition } from '@swimlane/ngx-charts';
import { ChartTypes } from '../constants';

export type ChartDescriptionId = string;
export type JSONString = string;

export interface ChartDescription {
  id: ChartDescriptionId;
  chartType: ChartTypes;
  chartData: JSONString;
}

export interface BarChartData {
  view: [number, number];
  colorScheme: string | Color;
  gradient: boolean;
  xAxis: boolean;
  yAxis: boolean;
  legend: boolean;
  showXAxisLabel: boolean;
  showYAxisLabel: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  results: NonCompoundChartResults[];
}

export interface NonCompoundChartResults {
  name: string;
  value: number;
  extra?: any;
}

export interface PieChartData {
  view: [number, number];
  colorScheme: string | Color;
  gradient: boolean;
  showLegend: boolean;
  showLabels: boolean;
  isDoughnut: boolean;
  explodeSlices: boolean;
  legendPosition: LegendPosition;
  results: NonCompoundChartResults[];
  arcWidth: number;
}
