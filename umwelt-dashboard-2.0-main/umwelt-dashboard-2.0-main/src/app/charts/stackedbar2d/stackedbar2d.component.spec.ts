import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stackedbar2dComponent } from './stackedbar2d.component';

describe('Stackedbar2dComponent', () => {
  let component: Stackedbar2dComponent;
  let fixture: ComponentFixture<Stackedbar2dComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Stackedbar2dComponent]
    });
    fixture = TestBed.createComponent(Stackedbar2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
