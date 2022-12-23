import {
  FlexboxPositioningOptions,
  FlexboxFlowOptions,
  ChartTypes,
  barVerticalExample,
  pieChartExample,
} from '../../constants/constants';

export class Defaults {
  public static defaultImageWidth = 200;
  public static justifyContent = FlexboxPositioningOptions.CENTER;
  public static alignItems = FlexboxPositioningOptions.CENTER;
  public static flow = FlexboxFlowOptions.ROW;

  public static minGraphSize = 150;
  public static maxGraphSize = 2000;

  public static getChartExample(chartType: ChartTypes) {
    const m = new Map();
    m.set(ChartTypes.BAR_VERTICAL, barVerticalExample);
    m.set(ChartTypes.PIE, pieChartExample);

    return m.get(chartType);
  }
}
