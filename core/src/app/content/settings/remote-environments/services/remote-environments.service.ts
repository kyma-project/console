import {
  IRemoteEnvironment,
  RemoteEnvironment
} from '../../../../shared/datamodel/k8s/kyma-api/remote-environment';
import { List } from '../../../../shared/datamodel/k8s/generic/list';
import { AppConfig } from '../../../../app.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';
import * as _ from 'lodash';

@Injectable()
export class RemoteEnvironmentsService {
  private url = AppConfig.k8sApiServerUrl_remoteenvs;

  constructor(private graphQLClientService: GraphQLClientService) {}

  getRemoteEnvironment(name: string): Observable<any> {
    // ToDo: add labels
    const query = `query RemoteEnvironment($name: String!) {
        remoteEnvironment(name: $name){
          description
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
