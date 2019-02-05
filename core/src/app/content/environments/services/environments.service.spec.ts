import { TestBed } from '@angular/core/testing';
import { EnvironmentsService } from './environments.service';
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
  request: (url = '', query, variables) => {
    switch (variables.namespace) {
      case 'namespace':
        return of(resourceQuotaLimitOK);
      default:
        return of(resourceQuotaLimitExceeded);
    }
  }
};

describe('EnvironmentsService', () => {
  let environmentsService: EnvironmentsService;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EnvironmentsService,
        { provide: GraphQLClientService, useValue: graphlQLClientServiceMock }
      ]
    });

    environmentsService = TestBed.get(EnvironmentsService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should return empty collection of environments', async () => {
    // given
    const environments = [];

    // then
    await environmentsService.getEnvironments().subscribe(users => {
      expect(users.length).toBe(0);
      expect(users).toEqual(environments);
    });

    // when
    const req = httpClientMock.expectOne(
      `${AppConfig.k8sApiServerUrl}namespaces?labelSelector=env=true`
    );
    req.flush(environments);
  });

  it('should return collection of 2 environments', async () => {
    // then
    await environmentsService.getEnvironments().subscribe(es => {
      const first = es[0];
      const second = es[1];

      expect(es.length).toEqual(2);
      expect(first.getId()).toBe('first');
      expect(first.getUid()).toBe('uidFirst');
      expect(first.getId()).toBe(first.getLabel());
    });

    // when
    const req = httpClientMock.expectOne(
      AppConfig.k8sApiServerUrl + 'namespaces?labelSelector=env=true'
    );
    req.flush({
      kind: 'NamespaceList',
      items: [
        {
          metadata: {
            name: 'first',
            uid: 'uidFirst',
            labels: {
              env: 'true'
            }
          },
          status: {
            phase: 'Active'
          }
        },
        {
          metadata: {
            name: 'second',
            uid: 'uidSecond',
            labels: {
              env: 'true'
            }
          },
          status: {
            phase: 'Active'
          }
        },
        {
          metadata: {
            name: 'third',
            uid: 'uidThird',
            labels: {
              env: 'true'
            }
          },
          status: {
            phase: 'Passive'
          }
        }
      ]
    });
  });

  it('should handle an authorization error', async () => {
    // then
    await environmentsService.getEnvironments().subscribe(
      res => {},
      err => {
        expect(err).toBeTruthy();
        expect(err.status).toEqual(401);
      }
    );

    // when
    const req = httpClientMock.expectOne(
      AppConfig.k8sApiServerUrl + 'namespaces?labelSelector=env=true'
    );
    req.flush(
      {},
      {
        status: 401,
        statusText: 'Unauthorized'
      }
    );
  });

  it('should return an environment', done => {
    // given
    const id = 'first';

    // when
    const result = environmentsService.getEnvironment(id);

    // then
    result.subscribe(r => {
      expect(r.getId()).toBe('first');
      expect(r.getUid()).toBe('uidFirst');
      expect(r.getId()).toBe(r.getLabel());
      done();
    });

    const req = httpClientMock.expectOne(
      AppConfig.k8sApiServerUrl + 'namespaces/' + id
    );
    req.flush({
      kind: 'Namespace',
      metadata: {
        name: 'first',
        uid: 'uidFirst',
        labels: {
          env: 'true'
        }
      },
      status: {
        phase: 'Active'
      }
    });
  });

  it(`shouldn't find any environment`, done => {
    // given
    const id = 'noexisting';

    // when
    const result = environmentsService.getEnvironment(id);

    // then
    result.subscribe(err => {
      expect(err['code']).toEqual(404);
      done();
    });

    const req = httpClientMock.expectOne(
      AppConfig.k8sApiServerUrl + 'namespaces/' + id
    );

    req.flush({
      kind: 'Status',
      metadata: {},
      status: 'Failure',
      reason: 'NotFound',
      details: {
        name: 'noexisting',
        kind: 'namespaces'
      },
      code: 404
    });
  });

  it('should handle an internal server error', done => {
    // given
    const id = 'first';

    // when
    const result = environmentsService.getEnvironment(id);

    // then
    result.subscribe(
      res => {},
      err => {
        expect(err['status']).toEqual(500);
        done();
      }
    );

    const req = httpClientMock.expectOne(
      AppConfig.k8sApiServerUrl + 'namespaces/' + id
    );
    req.flush(
      {},
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    );
  });

  it('should return the status of resource quota with an empty list if everything is ok', done => {
    // given
    const environment = 'namespace';

    // when
    const result = environmentsService.getResourceQueryStatus(environment);

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
    const environment = 'environmentWithResourceLimitExceeded';

    // when
    const result = environmentsService.getResourceQueryStatus(environment);

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
