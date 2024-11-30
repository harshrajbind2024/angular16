import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnpsTableComponent } from './enps-table.component';

describe('EnpsTableComponent', () => {
  let component: EnpsTableComponent;
  let fixture: ComponentFixture<EnpsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnpsTableComponent]
    });
    fixture = TestBed.createComponent(EnpsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
