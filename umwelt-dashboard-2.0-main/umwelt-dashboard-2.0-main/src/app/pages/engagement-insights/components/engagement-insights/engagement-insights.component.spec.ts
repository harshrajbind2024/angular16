import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementInsightsComponent } from './engagement-insights.component';

describe('EngagementInsightsComponent', () => {
  let component: EngagementInsightsComponent;
  let fixture: ComponentFixture<EngagementInsightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EngagementInsightsComponent]
    });
    fixture = TestBed.createComponent(EngagementInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});