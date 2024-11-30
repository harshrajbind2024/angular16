import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { childauthGuard } from './childauth.guard';

describe('childauthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => childauthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
