import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedColumn2dComponent } from './stacked-column2d.component';

describe('StackedColumn2dComponent', () => {
  let component: StackedColumn2dComponent;
  let fixture: ComponentFixture<StackedColumn2dComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StackedColumn2dComponent]
    });
    fixture = TestBed.createComponent(StackedColumn2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
