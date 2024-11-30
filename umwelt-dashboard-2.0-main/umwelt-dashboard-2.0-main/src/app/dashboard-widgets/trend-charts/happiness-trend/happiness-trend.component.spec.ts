import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappinessTrendComponent } from './happiness-trend.component';

describe('HappinessTrendComponent', () => {
  let component: HappinessTrendComponent;
  let fixture: ComponentFixture<HappinessTrendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HappinessTrendComponent]
    });
    fixture = TestBed.createComponent(HappinessTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
