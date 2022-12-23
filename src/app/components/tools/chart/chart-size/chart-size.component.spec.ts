import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSizeComponent } from './chart-size.component';

describe('ChartSizeComponent', () => {
  let component: ChartSizeComponent;
  let fixture: ComponentFixture<ChartSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartSizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
