import { TestBed } from '@angular/core/testing';

import { FantasyAPIService } from './fantasy-api.service';

describe('FantasyAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FantasyAPIService = TestBed.get(FantasyAPIService);
    expect(service).toBeTruthy();
  });
});
