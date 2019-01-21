import { TestBed } from '@angular/core/testing';

import { LuigiClientService } from './luigi-client.service';

describe('LuigiClientService', () => {
  let luigiClientService: LuigiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LuigiClientService]
    });

    luigiClientService = TestBed.get(LuigiClientService);
  });

  describe('hasBackendModule()', () => {
    beforeEach(() => {
      luigiClientService['luigiClient'] = {
        getEventData: jasmine.createSpy('getEventData')
      };
      luigiClientService['luigiClient'].getEventData.and.returnValue({
        backendModules: ['a', 'b', 'c', 'd']
      });
    });

    it('returns true if backend module exists', () => {
      expect(luigiClientService.hasBackendModule('b')).toBe(true);
    });

    it('returns false if backend module does not exist', () => {
      expect(luigiClientService.hasBackendModule('s')).toBe(false);
    });
  });
});
