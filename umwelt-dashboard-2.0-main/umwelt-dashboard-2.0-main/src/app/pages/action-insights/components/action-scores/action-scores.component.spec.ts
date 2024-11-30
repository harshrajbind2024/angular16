import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionScoresComponent } from './action-scores.component';

describe('ActionScoresComponent', () => {
  let component: ActionScoresComponent;
  let fixture: ComponentFixture<ActionScoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionScoresComponent]
    });
    fixture = TestBed.createComponent(ActionScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
