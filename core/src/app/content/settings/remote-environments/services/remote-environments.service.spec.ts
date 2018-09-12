import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AppConfig } from '../../../../app.config';
import { Observable, of } from 'rxjs';
import { RemoteEnvironment } from './../../../../shared/datamodel/k8s/kyma-api/remote-environment';

import { RemoteEnvironmentsService } from './remote-environments.service';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';

const environmentFromGraphQL = {
  remoteEnvironment: {
    description: 'description',
    enabledInEnvironments: ['environment'],
    name: 'some-name',
    services: [],
    source: {
      environment: 'env1 name',
      namespace: 'namespace name',
      type: 'example type'
    }
  }
};

const graphlQLClientServiceMock = {
  request: (url = '', query, variables) => {
    switch (variables.name) {
      case 'some-name':
        return of(environmentFromGraphQL);
      default:
        return of(null);
    }
  }
};

describe('RemoteEnvironmentsService', () => {
  let remoteEnvironmentsService: RemoteEnvironmentsService;
  let graphQLClientService: GraphQLClientService;
  let httpClientMock: HttpTestingController;

  const queryRE = `query RemoteEnvironment($name: String!) {
        remoteEnvironment(name: $name){
          description
          name
          enabledInEnvironments
          services {
            displayName
            entries {
              type
            }
          }
          source {
            environment
            namespace
            type
          }
        }
      }`;

  const variablesRE = {
    name: 'some-name'
  };

  const environment = {
    kind: 'somekind',
    apiVersion: 'someapiVersion',
    metadata: {
      selfLink: 'someselfLink',
      resourceVersion: 'someresourceVersion',
      name: 'somename'
    },
    spec: {
      bindings: ['somebindings'],
      description: 'somedescription',
      clusterKey: 'someclusterKey',
      type: 'sometype',
      environment: 'someecEnvName'
    },
    status: {
      phase: 'Active'
    },
    items: [
      {
        metadata: {
          name: 'somename2',
          selfLink: 'someselfLink2',
          uid: 'someuid',
          resourceVersion: 'someresourceVersion2',
          generation: 1,
          creationTimestamp: 'somecreationTimestamp',
          labels: {
            test: 'sometest'
          }
        },
        spec: {
          bindings: [
            {
              id: 'someid',
              label: 'somelabel'
            }
          ],
          clusterKey: 'someclusterKey2',
          type: 'sometype2',
          environment: 'someecEnvName2',
          description: 'somedescription2'
        },
        status: {
          phase: 'Active'
        }
      }
    ]
  };

  const environmentWithNoItems = {
    kind: 'somekind',
    apiVersion: 'someapiVersion',
    metadata: {
      selfLink: 'someselfLink',
      resourceVersion: 'someresourceVersion',
      name: 'somename'
    },
    spec: {
      bindings: ['somebindings'],
      description: 'somedescription',
      clusterKey: 'someclusterKey',
      type: 'sometype',
      environment: 'someecEnvName'
    },
    items: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RemoteEnvironmentsService,
        { provide: GraphQLClientService, useValue: graphlQLClientServiceMock }
      ]
    });
    remoteEnvironmentsService = TestBed.get(RemoteEnvironmentsService);
    graphQLClientService = TestBed.get(GraphQLClientService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(remoteEnvironmentsService).toBeTruthy();
  });

  describe('getRemoteEnvironment()', () => {
    it('should return remote environment details', done => {
      remoteEnvironmentsService
        .getRemoteEnvironment(variablesRE.name)
        .subscribe(res => {
          expect(res.remoteEnvironment.name).toBe(variablesRE.name);
          done();
        });
    });

    it('should return no environment details', done => {
      const variablesNoExistRE = {
        name: 'doesntExist'
      };
      remoteEnvironmentsService
        .getRemoteEnvironment(variablesNoExistRE.name)
        .subscribe(res => {
          expect(res).toBeNull();
          done();
        });
    });
  });
});
