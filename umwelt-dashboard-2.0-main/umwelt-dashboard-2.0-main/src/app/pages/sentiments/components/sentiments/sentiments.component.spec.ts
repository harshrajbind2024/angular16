import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentsComponent } from './sentiments.component';

describe('SentimentsComponent', () => {
  let component: SentimentsComponent;
  let fixture: ComponentFixture<SentimentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentimentsComponent]
    });
    fixture = TestBed.createComponent(SentimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});