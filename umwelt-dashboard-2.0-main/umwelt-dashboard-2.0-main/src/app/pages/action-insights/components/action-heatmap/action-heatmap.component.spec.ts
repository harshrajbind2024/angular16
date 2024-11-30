import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionHeatmapComponent } from './action-heatmap.component';

describe('ActionHeatmapComponent', () => {
  let component: ActionHeatmapComponent;
  let fixture: ComponentFixture<ActionHeatmapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionHeatmapComponent]
    });
    fixture = TestBed.createComponent(ActionHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
