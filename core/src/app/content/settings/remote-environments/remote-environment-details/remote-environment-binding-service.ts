import { AppConfig } from './../../../../app.config';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';

@Injectable()
export class RemoteEnvironmentBindingService {
  public envChangeStateEmitter$: EventEmitter<boolean>;

  constructor(
    private http: HttpClient,
    private graphQLClientService: GraphQLClientService
  ) {
    this.envChangeStateEmitter$ = new EventEmitter();
  }

  graphQLClientCall(query, variables) {
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }

  public bind(namespace, remoteEnvironment) {
    const query = `mutation($namespace: String!, $remoteEnvironment: String!){
      enableApplication(namespace: $namespace, application: $remoteEnvironment) {
        namespace
        application
      }
    }`;
    const variables = {
      namespace,
      remoteEnvironment
    };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }

  public unbind(namespace, remoteEnvironment) {
    const query = `mutation($namespace: String!, $remoteEnvironment: String!){
      disableApplication(namespace: $namespace, application: $remoteEnvironment) {
        namespace
        application
      }
    }`;
    const variables = {
      namespace,
      remoteEnvironment
    };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }

  public getBoundEnvironments(remoteEnvironment) {
    const query = `query Environment($remoteEnvironment: String!){
      namespaces(application: $remoteEnvironment) {
        name
      }
    }`;
    const variables = { remoteEnvironment };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }

  public getBoundRemoteEnvironments(namespace) {
    const query = `query Application($namespace: String!){
      applications(namespace: $namespace) {
        name
      }
    }`;
    const variables = { namespace };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }
}
