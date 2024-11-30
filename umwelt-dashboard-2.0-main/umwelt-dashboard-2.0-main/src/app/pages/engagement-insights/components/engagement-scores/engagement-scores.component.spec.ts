import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementScoresComponent } from './engagement-scores.component';

describe('EngagementScoresComponent', () => {
  let component: EngagementScoresComponent;
  let fixture: ComponentFixture<EngagementScoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EngagementScoresComponent]
    });
    fixture = TestBed.createComponent(EngagementScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
