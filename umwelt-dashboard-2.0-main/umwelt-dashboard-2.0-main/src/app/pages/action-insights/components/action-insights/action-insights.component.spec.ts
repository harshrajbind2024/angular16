import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionInsightsComponent } from './action-insights.component';

describe('ActionInsightsComponent', () => {
  let component: ActionInsightsComponent;
  let fixture: ComponentFixture<ActionInsightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionInsightsComponent]
    });
    fixture = TestBed.createComponent(ActionInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
