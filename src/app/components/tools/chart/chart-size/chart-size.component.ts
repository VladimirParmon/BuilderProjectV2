import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chart-size',
  templateUrl: './chart-size.component.html',
  styleUrls: ['./chart-size.component.scss'],
})
export class ChartSizeComponent {
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() equalSides: boolean = false;
  @Output('handle-size-change') handleSizeChange = new EventEmitter<{
    event: Event;
    isWidth: boolean;
    prevailingValue?: number;
  }>();

  constructor() {}

  handleChange(event: Event, isWidth: boolean) {
    if (this.equalSides) {
      const input = event.target as HTMLInputElement;
      let value = Number(input.value);
      if (isWidth) this.handleSizeChange.emit({ event, isWidth, prevailingValue: value });
    } else {
      this.handleSizeChange.emit({ event, isWidth });
    }
  }
}
