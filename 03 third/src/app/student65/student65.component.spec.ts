import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Student65Component } from './student65.component';

describe('Student65Component', () => {
  let component: Student65Component;
  let fixture: ComponentFixture<Student65Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Student65Component]
    });
    fixture = TestBed.createComponent(Student65Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
