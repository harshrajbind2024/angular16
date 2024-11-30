import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Donut2dComponent } from './donut2d.component';

describe('Donut2dComponent', () => {
  let component: Donut2dComponent;
  let fixture: ComponentFixture<Donut2dComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Donut2dComponent]
    });
    fixture = TestBed.createComponent(Donut2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
