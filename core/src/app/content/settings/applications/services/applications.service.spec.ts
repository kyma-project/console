import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppConfig } from '../../../../app.config';
import { ApplicationsService } from './applications.service';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';
declare interface IApplicationQueryData {
  name: string;
  description: string;
  labels: {};
}

describe('ApplicationsService', () => {
  let applicationsService: ApplicationsService;
  let graphQLClientService: GraphQLClientService;
  const getApplicationQueryData = (): IApplicationQueryData => {
    return {
      name: 'a-name',
      description: 'a-description',
      labels: { key1: 'value1' }
    };
  };

  beforeEach(() => {
    const mockGraphQLClientService = {
      gqlMutation: jasmine
      .createSpy('GraphQL-mutation')
      .and.returnValue(of('request-response')),
      gqlQuery: jasmine
      .createSpy('GraphQL-query')
      .and.returnValue(of('request-response'))
    };

    TestBed.configureTestingModule({
      providers: [
        ApplicationsService,
        { provide: GraphQLClientService, useValue: mockGraphQLClientService }
      ]
    });
    applicationsService = TestBed.get(ApplicationsService);
    graphQLClientService = TestBed.get(GraphQLClientService);
  });

  it('should be created', () => {
    expect(applicationsService).toBeTruthy();
  });

  describe('createApplication()', () => {
    it('calls request method with params', () => {
      const mutation = `mutation createApplication($name: String!, $description: String!, $labels: Labels) {
      createApplication(name: $name, description: $description, labels: $labels) {
        name
      }
    }`;
      const dataInput: IApplicationQueryData = getApplicationQueryData();
      const dataForRequest: IApplicationQueryData = getApplicationQueryData();
      applicationsService.createApplication(dataInput);
      expect(graphQLClientService.gqlMutation).toHaveBeenCalledWith(
        mutation,
        dataForRequest
      );
    });

    it('returns the call to request method', () => {
      const data: IApplicationQueryData = getApplicationQueryData();
      applicationsService.createApplication(data).subscribe(res => {
        expect(res).toBe('request-response');
      });
    });
  });

  describe('updateApplication()', () => {
    it('calls request method with params', () => {
      const mutation = `mutation updateApplication($name: String!, $description: String, $labels: Labels) {
      updateApplication(name: $name, description: $description, labels: $labels) {
        name
      }
    }`;
      const dataInput: IApplicationQueryData = getApplicationQueryData();
      const dataForRequest: IApplicationQueryData = getApplicationQueryData();
      applicationsService.updateApplication(dataInput);
      expect(graphQLClientService.gqlMutation).toHaveBeenCalledWith(
        mutation,
        dataForRequest
      );
    });

    it('returns the call to request method', () => {
      const data: IApplicationQueryData = getApplicationQueryData();
      applicationsService.updateApplication(data).subscribe(res => {
        expect(res).toBe('request-response');
      });
    });
  });

  describe('getApplication()', () => {
    it('calls request method with params', () => {
      const name = 'some-name';
      const query = `query Application($name: String!) {
        application(name: $name){
          description
          labels
          name
          enabledInNamespaces
          status
          services {
            displayName
            entries {
              type
            }
          }
        }
      }`;
      applicationsService.getApplication(name);
      expect(graphQLClientService.gqlQuery).toHaveBeenCalledWith(
        query,
        { name }
      );
    });

    it('returns the call to request method', () => {
      const name = 'some-name';
      applicationsService.getApplication(name).subscribe(res => {
        expect(res).toBe('request-response');
      });
    });
  });
});
