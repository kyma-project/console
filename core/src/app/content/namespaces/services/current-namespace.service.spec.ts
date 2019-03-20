import { TestBed, inject } from '@angular/core/testing';

import { CurrentNamespaceService } from './current-namespace.service';

describe('CurrentNamespaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentNamespaceService]
    });
  });

  it('should be created', inject([CurrentNamespaceService], (service: CurrentNamespaceService) => {
    expect(service).toBeTruthy();
  }));
});
