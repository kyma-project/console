import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppConfig } from '../../../../app.config';
import { RemoteEnvironmentsService } from './remote-environments.service';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';
declare interface IRemoteEnvQueryData {
  name: string;
  description: string;
  labels: {};
}

describe('RemoteEnvironmentsService', () => {
  let remoteEnvironmentsService: RemoteEnvironmentsService;
  let graphQLClientService: GraphQLClientService;
  const getRemoteEnvQueryData = (): IRemoteEnvQueryData => {
    return {
      name: 'a-name',
      description: 'a-description',
      labels: { key1: 'value1' }
    };
  };

  beforeEach(() => {
    const mockGraphQLClientService = {
      request: jasmine
        .createSpy('GraphQL-request')
        .and.returnValue(of('request-response'))
    };

    TestBed.configureTestingModule({
      providers: [
        RemoteEnvironmentsService,
        { provide: GraphQLClientService, useValue: mockGraphQLClientService }
      ]
    });
    remoteEnvironmentsService = TestBed.get(RemoteEnvironmentsService);
    graphQLClientService = TestBed.get(GraphQLClientService);
  });

  it('should be created', () => {
    expect(remoteEnvironmentsService).toBeTruthy();
  });

  describe('createRemoteEnvironment()', () => {
    it('calls request method with params', () => {
      const mutation = `mutation createRemoteEnvironment($name: String!, $description: String!, $labels: Labels) {
      createRemoteEnvironment(name: $name, description: $description, labels: $labels) {
        name
      }
    }`;
      const dataInput: IRemoteEnvQueryData = getRemoteEnvQueryData();
      const dataForRequest: IRemoteEnvQueryData = getRemoteEnvQueryData();
      remoteEnvironmentsService.createRemoteEnvironment(dataInput);
      expect(graphQLClientService.request).toHaveBeenCalledWith(
        AppConfig.graphqlApiUrl,
        mutation,
        dataForRequest
      );
    });

    it('returns the call to request method', () => {
      const data: IRemoteEnvQueryData = getRemoteEnvQueryData();
      remoteEnvironmentsService.createRemoteEnvironment(data).subscribe(res => {
        expect(res).toBe('request-response');
      });
    });
  });

  describe('updateRemoteEnvironment()', () => {
    it('calls request method with params', () => {
      const mutation = `mutation updateRemoteEnvironment($name: String!, $description: String, $labels: Labels) {
        updateRemoteEnvironment(name: $name, description: $description, labels: $labels) {
          name
        }
      }`;
      const dataInput: IRemoteEnvQueryData = getRemoteEnvQueryData();
      const dataForRequest: IRemoteEnvQueryData = getRemoteEnvQueryData();
      remoteEnvironmentsService.updateRemoteEnvironment(dataInput);
      expect(graphQLClientService.request).toHaveBeenCalledWith(
        AppConfig.graphqlApiUrl,
        mutation,
        dataForRequest
      );
    });

    it('returns the call to request method', () => {
      const data: IRemoteEnvQueryData = getRemoteEnvQueryData();
      remoteEnvironmentsService.updateRemoteEnvironment(data).subscribe(res => {
        expect(res).toBe('request-response');
      });
    });
  });

  describe('getRemoteEnvironment()', () => {
    it('calls request method with params', () => {
      const name = 'some-name';
      const query = `query RemoteEnvironment($name: String!) {
        remoteEnvironment(name: $name){
          description
          labels
          name
          enabledInEnvironments
          status
          services {
            displayName
            entries {
              type
            }
          }
        }
      }`;
      remoteEnvironmentsService.getRemoteEnvironment(name);
      expect(graphQLClientService.request).toHaveBeenCalledWith(
        AppConfig.graphqlApiUrl,
        query,
        { name }
      );
    });

    it('returns the call to request method', () => {
      const name = 'some-name';
      remoteEnvironmentsService.getRemoteEnvironment(name).subscribe(res => {
        expect(res).toBe('request-response');
      });
    });
  });
});
