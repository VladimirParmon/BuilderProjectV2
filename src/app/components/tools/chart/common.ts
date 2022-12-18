import { Defaults } from 'src/app/services/defaults';
import { NonCompoundChartResults } from 'src/constants/models';
import { BarVerticalComponent } from './bar-vertical/bar-vertical.component';
import { PieComponent } from './pie/pie.component';

export function _handleSizeChange(
  this: BarVerticalComponent | PieComponent,
  { event, isWidth, prevailingValue }: { event: Event; isWidth: boolean; prevailingValue?: number }
) {
  const input = event.target as HTMLInputElement;
  let value = Number(input.value);
  value = value >= Defaults.minGraphSize ? value : Defaults.minGraphSize;
  value = value <= Defaults.maxGraphSize ? value : Defaults.maxGraphSize;
  if (this.chartData) {
    if (!prevailingValue) {
      const oldWidth = this.chartData.view[0];
      const oldHeight = this.chartData.view[1];
      const newSizes: [number, number] = isWidth ? [value, oldHeight] : [oldWidth, value];
      this.chartData = { ...this.chartData, view: newSizes };
    } else {
      const newSizes: [number, number] = [prevailingValue, prevailingValue];
      this.chartData = { ...this.chartData, view: newSizes };
    }
  }
  this.inputDebounce.next(true);
}

export function _deleteEntry(this: BarVerticalComponent | PieComponent, entryName: string) {
  if (this.chartData) {
    const array = this.utilsService
      .arrayDeepCopy(this.chartData.results)
      .filter((e) => e.name !== entryName);
    this.dispatchToParent(array);
  }
}

export function _addEntry(this: BarVerticalComponent | PieComponent) {
  if (this.chartData) {
    const array = this.utilsService.arrayDeepCopy(this.chartData.results);
    array.push({
      name: `Новое поле ${array.length + 1}`,
      value: 0,
    });
    this.dispatchToParent(array);
  }
}

export function _dispatchToParent(
  this: BarVerticalComponent | PieComponent,
  array?: NonCompoundChartResults[]
) {
  const newData = JSON.stringify({
    ...this.chartData,
    results: array || this.chartData?.results,
  });
  this.dispatch.emit(newData);
}
