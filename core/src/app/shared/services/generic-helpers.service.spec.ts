import { TestBed } from '@angular/core/testing';

import { GenericHelpersService } from './generic-helpers.service';

describe('GenericHelpersService', () => {
  let genericHelpers: GenericHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [GenericHelpersService] });

    genericHelpers = TestBed.get(GenericHelpersService);
  });

  describe('getHostnameURL()', () => {
    it('returns https://hostname if domain is not provided', () => {
      expect(genericHelpers.getHostnameURL('testhostname')).toBe(
        'https://testhostname'
      );
    });

    it('returns https://hostname.domain', () => {
      expect(genericHelpers.getHostnameURL('testhostname', '.testdomain')).toBe(
        'https://testhostname.testdomain'
      );
    });
  });

  describe('addDomainIfMissing()', () => {
    it('returns adds domain if hostname is short', () => {
      expect(genericHelpers.addDomainIfMissing('hostname', 'domain.com')).toBe(
        'hostname.domain.com'
      );
    });

    it('returns hostname if it has domain', () => {
      expect(
        genericHelpers.addDomainIfMissing('hostname.domain.com', 'domain.com')
      ).toBe('hostname.domain.com');
    });
  });
});
