import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedoMeterComponent } from './speedo-meter.component';

describe('SpeedoMeterComponent', () => {
  let component: SpeedoMeterComponent;
  let fixture: ComponentFixture<SpeedoMeterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpeedoMeterComponent]
    });
    fixture = TestBed.createComponent(SpeedoMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
