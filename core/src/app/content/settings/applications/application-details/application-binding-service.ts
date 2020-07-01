import { Injectable, EventEmitter } from '@angular/core';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Injectable()
export class ApplicationBindingService {
  public namespaceChangeStateEmitter$: EventEmitter<boolean>;

  constructor(
    private graphQLClientService: GraphQLClientService
  ) {
    this.namespaceChangeStateEmitter$ = new EventEmitter();
  }

  public bind(namespace, application, allServices, services) {
    const query = `mutation($namespace: String!, $application: String!, $allServices: Boolean, $services: [ApplicationMappingService]){
      enableApplication(namespace: $namespace, application: $application, allServices: $allServices, services: $services) {
        namespace
        application
        allServices
        services
      }
    }`;
    const variables = {
      namespace,
      application,
      allServices,
      services
    };

    return this.graphQLClientService.gqlMutation(query, variables);
  }

  public update(namespace, application, allServices, services) {
    const query = `mutation($namespace: String!, $application: String!, $allServices: Boolean, $services: [ApplicationMappingService]){
      overloadApplication(namespace: $namespace, application: $application, allServices: $allServices, services: $services) {
        namespace
        application
        allServices
        services
      }
    }`;
    const variables = {
      namespace,
      application,
      allServices,
      services
    };

    return this.graphQLClientService.gqlMutation(query, variables);
  }

  public unbind(namespace, application) {
    const query = `mutation($namespace: String!, $application: String!){
      disableApplication(namespace: $namespace, application: $application) {
        namespace
        application
        allServices
        services
      }
    }`;
    const variables = {
      namespace,
      application
    };

    return this.graphQLClientService.gqlMutation(query, variables);
  }
}
