import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { AppConfig } from '../../../../app.config';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';

@Injectable()
export class ApplicationsService {
  constructor(private graphQLClientService: GraphQLClientService) {}

  public createApplication({
    name,
    labels,
    description
  }: {
    name: string;
    description: string;
    labels: {};
  }): Observable<any> {
    const data = { name, description, labels };
    const mutation = `mutation createApplication($name: String!, $description: String!, $labels: Labels) {
      createApplication(name: $name, description: $description, labels: $labels) {
        name
      }
    }`;

    return this.graphQLClientService.gqlMutation(
      mutation,
      data
    );
  }

  public updateApplication({
    name,
    labels,
    description
  }: {
    name: string;
    description: string;
    labels: {};
  }): Observable<any> {
    const data = { name, description, labels };
    const mutation = `mutation updateApplication($name: String!, $description: String, $labels: Labels) {
      updateApplication(name: $name, description: $description, labels: $labels) {
        name
      }
    }`;

    return this.graphQLClientService.gqlMutation(
      mutation,
      data
    );
  }

  getApplication(name: string): Observable<any> {
    const query = `query Application($name: String!) {
        application(name: $name){
          description
          labels
          name
          enabledMappingServices {
            namespace
            allServices
            services {
              id
              displayName
              exist
            }
          }
          status
          services {
            id
            displayName
            entries {
              type
            }
          }
        }
      }`;

    const variables = { name };

    return this.graphQLClientService.gqlQuery(
      query,
      variables
    );
  }

  deleteApplication(name: string): Observable<any> {
    const data = { name };
    const mutation = `mutation deleteApplication($name: String!) {
      deleteApplication(name: $name) {
        name
      }
    }`;

    return this.graphQLClientService.gqlMutation(
      mutation,
      data
    );
  }

  getConnectorServiceUrl(name: string): Observable<any> {
    const query = `query ConnectorService($application: String!) {
      connectorService(application: $application){
        url
      }
    }`;

    const variables = {
      application: name
    };

    return this.graphQLClientService.gqlQuery(
      query,
      variables
    );
  }

  public determineStatusType(entry) {
    switch (entry.status) {
      case 'GATEWAY_NOT_CONFIGURED':
      case 'NOT_SERVING':
        return 'warning';
      case 'SERVING':
        return 'success';
      default:
        return '';
    }
  }
}
