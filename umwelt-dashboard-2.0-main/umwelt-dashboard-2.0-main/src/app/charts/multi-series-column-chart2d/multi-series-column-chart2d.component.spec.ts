import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSeriesColumnChart2dComponent } from './multi-series-column-chart2d.component';

describe('MultiSeriesColumnChart2dComponent', () => {
  let component: MultiSeriesColumnChart2dComponent;
  let fixture: ComponentFixture<MultiSeriesColumnChart2dComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiSeriesColumnChart2dComponent]
    });
    fixture = TestBed.createComponent(MultiSeriesColumnChart2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
