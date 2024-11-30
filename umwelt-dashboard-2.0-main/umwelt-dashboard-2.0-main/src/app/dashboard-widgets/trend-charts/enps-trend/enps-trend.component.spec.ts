import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnpsTrendComponent } from './enps-trend.component';

describe('EnpsTrendComponent', () => {
  let component: EnpsTrendComponent;
  let fixture: ComponentFixture<EnpsTrendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnpsTrendComponent]
    });
    fixture = TestBed.createComponent(EnpsTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
