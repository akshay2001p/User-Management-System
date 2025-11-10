import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { forcePasswordResetGuard } from './force-password-reset-guard';

describe('forcePasswordResetGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => forcePasswordResetGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
