import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { AppConfig } from '../../../../app.config';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';

@Injectable()
export class RemoteEnvironmentsService {
  constructor(private graphQLClientService: GraphQLClientService) {}

  public createRemoteEnvironment({
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

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      mutation,
      data
    );
  }

  public updateRemoteEnvironment({
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

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      mutation,
      data
    );
  }

  getRemoteEnvironment(name: string): Observable<any> {
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

    const variables = { name };

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
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

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }

  public printPrettyConnectionStatus(status) {
    return _.startCase(_.toLower(status));
  }

  public determineClass(entry) {
    switch (entry.status) {
      case 'NOT_SERVING':
        return 'sf-indicator--error';
      case 'SERVING':
        return 'sf-indicator--success';
      case 'GATEWAY_NOT_CONFIGURED':
        return '';
      default:
        return '';
    }
  }
}
