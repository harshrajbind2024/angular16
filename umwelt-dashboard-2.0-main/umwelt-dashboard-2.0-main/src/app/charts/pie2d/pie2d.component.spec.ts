import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pie2dComponent } from './pie2d.component';

describe('Pie2dComponent', () => {
  let component: Pie2dComponent;
  let fixture: ComponentFixture<Pie2dComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Pie2dComponent]
    });
    fixture = TestBed.createComponent(Pie2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
