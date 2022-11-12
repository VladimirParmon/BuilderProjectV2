import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolGeneratorComponent } from './tool-generator.component';

describe('ToolGeneratorComponent', () => {
  let component: ToolGeneratorComponent;
  let fixture: ComponentFixture<ToolGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
