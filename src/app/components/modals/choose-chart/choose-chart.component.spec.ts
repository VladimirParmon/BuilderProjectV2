import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseChartComponent } from './choose-chart.component';

describe('ChooseChartComponent', () => {
  let component: ChooseChartComponent;
  let fixture: ComponentFixture<ChooseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
