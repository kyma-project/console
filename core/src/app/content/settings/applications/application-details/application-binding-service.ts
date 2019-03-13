import { AppConfig } from '../../../../app.config';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';

@Injectable()
export class ApplicationBindingService {
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

  public bind(namespace, application) {
    const query = `mutation($namespace: String!, $application: String!){
      enableApplication(namespace: $namespace, application: $application) {
        namespace
        application
      }
    }`;
    const variables = {
      namespace,
      application
    };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }

  public unbind(namespace, application) {
    const query = `mutation($namespace: String!, $application: String!){
      disableApplication(namespace: $namespace, application: $application) {
        namespace
        application
      }
    }`;
    const variables = {
      namespace,
      application
    };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }

  public getBoundEnvironments(application) {
    const query = `query Environment($application: String!){
      namespaces(application: $application) {
        name
      }
    }`;
    const variables = { application };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }

  public getBoundApplications(namespace) {
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
