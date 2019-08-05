import { TestBed } from '@angular/core/testing';

import { GenericHelpersService } from './generic-helpers.service';

describe('GenericHelpersService', () => {
  let genericHelpers: GenericHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [GenericHelpersService] });

    genericHelpers = TestBed.get(GenericHelpersService);
  });

  describe('getURL()', () => {
    it('sets domain if missing', () => {
      expect(
        genericHelpers.getURL({ host: 'testhostname', domain: 'testdomain' })
      ).toBe('https://testhostname.testdomain/');
    });

    it('deas not set domain if already provided', () => {
      expect(
        genericHelpers.getURL({
          host: 'testhostname.testdomain',
          domain: 'testdomain'
        })
      ).toBe('https://testhostname.testdomain/');
    });

    it('sets scheme', () => {
      expect(
        genericHelpers.getURL({
          host: 'testhostname',
          domain: 'testdomain',
          scheme: 'http'
        })
      ).toBe('http://testhostname.testdomain/');
    });

    it('sets port if provided', () => {
      expect(
        genericHelpers.getURL({
          host: 'testhostname',
          domain: 'testdomain',
          port: '80'
        })
      ).toBe('https://testhostname.testdomain:80/');
    });

    it('sets path', () => {
      expect(
        genericHelpers.getURL({
          host: 'testhostname',
          domain: 'testdomain',
          path: '/test/something'
        })
      ).toBe('https://testhostname.testdomain/test/something');
    });

    it('sets everything', () => {
      expect(
        genericHelpers.getURL({
          scheme: 'http',
          host: 'testhostname',
          domain: 'testdomain',
          port: '80',
          path: '/test/something'
        })
      ).toBe('http://testhostname.testdomain:80/test/something');
    });
  });
});
