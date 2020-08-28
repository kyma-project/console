import { TestBed } from '@angular/core/testing';
import { NamespacesService } from './namespaces.service';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AppConfig } from '../../../app.config';
import { of } from 'rxjs';

const resourceQuotaLimitOK = {
  resourceQuotaStatus: {
    exceeded: false,
    resources: []
  }
};

const resourceQuotaLimitExceeded = {
  resourceQuotaStatus: {
    exceeded: false,
    resources: [
      {
        quotaName: 'quota-name',
        resourceName: 'resource-name',
        affectedResources: ['affected-resource-1', 'affected-resource-2']
      }
    ]
  }
};

const graphlQLClientServiceMock = {
  gqlQuery: (query, variables) => {
    switch (variables.namespace) {
      case 'namespace':
        return of(resourceQuotaLimitOK);
      default:
        return of(resourceQuotaLimitExceeded);
    }
  }
};

describe('NamespacesService', () => {
  let namespacesService: NamespacesService;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NamespacesService,
        { provide: GraphQLClientService, useValue: graphlQLClientServiceMock },
      ]
    });

    namespacesService = TestBed.get(NamespacesService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should return the status of resource quota with an empty list if everything is ok', done => {
    // given
    const namespace = 'namespace';

    // when
    const result = namespacesService.getResourceQueryStatus(namespace);

    // then
    result.subscribe(
      res => {
        expect(res).toEqual(resourceQuotaLimitOK);
        done();
      },
      err => {}
    );
  });

  it('should return the status of resource quota with a list of resources that caused that the limit has been exceeded', done => {
    // given
    const namespace = 'namespaceWithResourceLimitExceeded';

    // when
    const result = namespacesService.getResourceQueryStatus(namespace);

    // then
    result.subscribe(
      res => {
        expect(res).toEqual(resourceQuotaLimitExceeded);
        done();
      },
      err => {}
    );
  });
});
