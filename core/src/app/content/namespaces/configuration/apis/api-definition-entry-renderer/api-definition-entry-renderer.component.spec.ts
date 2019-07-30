import { TestBed } from '@angular/core/testing';

import { ApiDefinitionEntryRendererComponent } from './api-definition-entry-renderer.component';

describe('ApiDefinitionEntryRendererComponent', () => {
  describe('addDomainIfMissing()', () => {
    it('returns adds domain if hostname is short', () => {
      expect(
        ApiDefinitionEntryRendererComponent.addDomainIfMissing(
          'hostname',
          'domain.com'
        )
      ).toBe('hostname.domain.com');
    });

    it('returns hostname if it has domain', () => {
      expect(
        ApiDefinitionEntryRendererComponent.addDomainIfMissing(
          'hostname.domain.com',
          'domain.com'
        )
      ).toBe('hostname.domain.com');
    });
  });
});
