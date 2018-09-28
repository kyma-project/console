import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import {
  IRemoteEnvironment,
  RemoteEnvironment
} from '../../../../shared/datamodel/k8s/kyma-api/remote-environment';
import { AppConfig } from '../../../../app.config';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';

@Injectable()
export class RemoteEnvironmentsService {
  private url = AppConfig.k8sApiServerUrl_remoteenvs;

  constructor(
    private graphQLClientService: GraphQLClientService,
    private httpClient: HttpClient
  ) {}

  public createRemoteEnvironment({ name, labels, description }) {
    const data = {
      metadata: { name },
      spec: { labels, description },
      kind: 'RemoteEnvironment',
      apiVersion: 'applicationconnector.kyma-project.io/v1alpha1'
    };
    return this.httpClient.post(this.url, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getRemoteEnvironment(name: string): Observable<any> {
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

    const variables = {
      name
    };

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }

  getConnectorServiceUrl(name: string): Observable<any> {
    const query = `query ConnectorService($remoteEnvironment: String!) {
      connectorService(remoteEnvironment: $remoteEnvironment){
        url
      }
    }`;

    const variables = {
      remoteEnvironment: name
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
