import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementHeatmapComponent } from './engagement-heatmap.component';

describe('EngagementHeatmapComponent', () => {
  let component: EngagementHeatmapComponent;
  let fixture: ComponentFixture<EngagementHeatmapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EngagementHeatmapComponent]
    });
    fixture = TestBed.createComponent(EngagementHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
