import { TestBed } from '@angular/core/testing';

import { StorageUnitsService } from './storage-units.service';

describe('StorageUnitsService', () => {
  let service: StorageUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
