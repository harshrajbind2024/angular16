import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrTrendComponent } from './hr-trend.component';

describe('HrTrendComponent', () => {
  let component: HrTrendComponent;
  let fixture: ComponentFixture<HrTrendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrTrendComponent]
    });
    fixture = TestBed.createComponent(HrTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
