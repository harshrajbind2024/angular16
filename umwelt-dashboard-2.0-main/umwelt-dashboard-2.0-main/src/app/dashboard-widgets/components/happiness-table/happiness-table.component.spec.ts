import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappinessTableComponent } from './happiness-table.component';

describe('HappinessTableComponent', () => {
  let component: HappinessTableComponent;
  let fixture: ComponentFixture<HappinessTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HappinessTableComponent]
    });
    fixture = TestBed.createComponent(HappinessTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
