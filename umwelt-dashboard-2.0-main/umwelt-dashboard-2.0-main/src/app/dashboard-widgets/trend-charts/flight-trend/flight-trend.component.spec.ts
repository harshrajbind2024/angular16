import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightTrendComponent } from './flight-trend.component';

describe('FlightTrendComponent', () => {
  let component: FlightTrendComponent;
  let fixture: ComponentFixture<FlightTrendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlightTrendComponent]
    });
    fixture = TestBed.createComponent(FlightTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
