
// it is not use because old

import { TestBed } from '@angular/core/testing';

import { AuthodlGuard } from './authodl.guard';

describe('AuthodlGuard', () => {
  let guard: AuthodlGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthodlGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
