import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chart-size',
  templateUrl: './chart-size.component.html',
  styleUrls: ['./chart-size.component.scss'],
})
export class ChartSizeComponent {
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Output('handle-size-change') handleSizeChange = new EventEmitter<{
    event: Event;
    isWidth: boolean;
  }>();

  constructor() {}
}
