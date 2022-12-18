import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chart-size',
  templateUrl: './chart-size.component.html',
  styleUrls: ['./chart-size.component.scss'],
})
export class ChartSizeComponent {
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() heightMustNotPrevail: boolean = false;
  @Output('handle-size-change') handleSizeChange = new EventEmitter<{
    event: Event;
    isWidth: boolean;
  }>();

  constructor() {}

  handleChange(event: Event, isWidth: boolean) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);
    if (isWidth) {
      const p =
        value >= this.width ? { event, isWidth } : { event, isWidth, prevailingValue: value };
      this.handleSizeChange.emit(p);
      return;
    } else {
      const p =
        value < this.width ? { event, isWidth } : { event, isWidth, prevailingValue: this.width };
      this.handleSizeChange.emit(p);
    }
  }
}
