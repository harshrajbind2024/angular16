import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHighlightsComponent } from './add-highlights.component';

describe('AddHighlightsComponent', () => {
  let component: AddHighlightsComponent;
  let fixture: ComponentFixture<AddHighlightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHighlightsComponent]
    });
    fixture = TestBed.createComponent(AddHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
