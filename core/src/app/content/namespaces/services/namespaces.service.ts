import { Injectable, EventEmitter } from '@angular/core';
import { NamespaceInfo } from '../namespace-info';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';

@Injectable()
export class NamespacesService {
  public namespaceChangeStateEmitter$: EventEmitter<boolean>;

  private readonly namespacesQuery = `query Namespace($showSystemNamespaces: Boolean) {
    namespaces(withSystemNamespaces: $showSystemNamespaces, withInactiveStatus: true){
      name
    }
  }`;

  constructor(
    private graphQLClientService: GraphQLClientService
  ) {
    this.namespaceChangeStateEmitter$ = new EventEmitter();
  }

  public getFilteredNamespaces(): Observable<NamespaceInfo[]> {
    const showSystemNamespaces = localStorage.getItem('console.showSystemNamespaces') === 'true';
    return this.graphQLClientService.gqlQuery(this.namespacesQuery, { withSystemNamespaces: showSystemNamespaces }).pipe(map(response => {
      return response.namespaces.map(namespace => new NamespaceInfo({
        name: namespace.name,
        uid: namespace.id,
        labels: namespace.labels,
      }))
    }, err => console.log(err)));
  }

  public getNamespace(id: string): Observable<NamespaceInfo> {
    const query = `query Namespace($name: String!) {
      namespace(name: $name) {
        name
        labels
        applications
        pods {
          name
          status
        }
        deployments {
          name
          status {
            replicas
            readyReplicas
          }
        }
      }
    }`;

    return this.graphQLClientService.gqlQuery(query, { name: id }).pipe(map(response => {
      const { namespace } = response;
      if (namespace) {
        const metadata = {
          name: namespace.name,
          uid: namespace.id,
          labels: namespace.labels,
        };
        return new NamespaceInfo(metadata);
      }
      return null;
    }));
  }

  public createNamespace(name: string, labels: object) {
    const mutation = `mutation CreateNamespace($name: String!, $labels: Labels) {
      createNamespace(name: $name, labels: $labels){
        name
      }
    }`;

    const variables = {
      name,
      labels
    };

    return this.graphQLClientService.gqlMutation(mutation, variables);
  }

  public createResourceQuotaAndLimitRange(
    namespace: string,
    memoryLimits: string,
    memoryRequests: string,
    memoryDefault: string,
    memoryDefaultRequest: string,
    memoryMax: string
  ) {
    const resourceQuota = {
      limits: {
        memory: memoryLimits
      },
      requests: {
        memory: memoryRequests
      }
    }
    const limitRange = {
      default: {
        memory: memoryDefault
      },
      defaultRequest: {
        memory: memoryDefaultRequest
      },
      max: {
        memory: memoryMax
      },
      type: 'Container'
    }

    const mutation = `mutation createResourceQuotaAndLimitRange(
      $namespace: String!,
      $rqName: String!,
      $lrName: String!,
      $resourceQuota: ResourceQuotaInput!,
      $limitRange: LimitRangeInput!
    ) {
      createResourceQuota(namespace: $namespace, name: $rqName, resourceQuota: $resourceQuota){
        name
      }
      createLimitRange(namespace: $namespace, name: $lrName, limitRange: $limitRange){
        name
      }
    }`;

    const variables = {
      namespace,
      lrName: `${namespace}-limit-range`,
      rqName: `${namespace}-resource-quota`,
      resourceQuota,
      limitRange
    };

    return this.graphQLClientService.gqlMutation(mutation, variables);
  }

  public createResourceQuota(namespace: string, memoryLimits: string, memoryRequests: string) {
    const resourceQuota = {
      limits: {
        memory: memoryLimits
      },
      requests: {
        memory: memoryRequests
      }
    }
    const mutation = `mutation CreateResourceQuota($namespace: String!, $name: String!, $resourceQuota: ResourceQuotaInput!) {
      createResourceQuota(namespace: $namespace, name: $name, resourceQuota: $resourceQuota){
        name
      }
    }`;

    const variables = {
      namespace,
      name: `${namespace}-resource-quota`,
      resourceQuota
    };

    return this.graphQLClientService.gqlMutation(mutation, variables);
  }

  public createLimitRange(namespace: string, memoryDefault: string, memoryDefaultRequest: string, memoryMax: string) {
    const limitRange = {
      default: {
        memory: memoryDefault
      },
      defaultRequest: {
        memory: memoryDefaultRequest
      },
      max: {
        memory: memoryMax
      },
      type: 'Container'
    }
    const mutation = `mutation CreateLimitRange($namespace: String!, $name: String!, $limitRange: LimitRangeInput!) {
      createLimitRange(namespace: $namespace, name: $name, limitRange: $limitRange){
        name
      }
    }`;

    const variables = {
      namespace,
      name: `${namespace}-limit-range`,
      limitRange
    };

    return this.graphQLClientService.gqlMutation(mutation, variables);
  }

  public deleteNamespace(name: string) {
    const mutation = `mutation DeleteNamespace($name: String!) {
      deleteNamespace(name: $name){
        name
      }
    }`;

    const variables = {
      name
    };

    return this.graphQLClientService.gqlMutation(mutation, variables).pipe(
      map(response => {
        this.namespaceChangeStateEmitter$.emit(true);
        return response;
      })
    );
  }

  public editNamespace(name: string, labels: object) {
    const mutation = `mutation UpdateNamespace($name: String!, $labels: Labels!) {
      updateNamespace(name: $name, labels: $labels){
        name
        labels
      }
    }`;

    const variables = {
      name,
      labels
    };

    return this.graphQLClientService.gqlMutation(mutation, variables);
  }

  public getResourceQueryStatus(namespace: string) {
    const query = `query ResourceQuotasStatus($namespace: String!) {
      resourceQuotasStatus(namespace: $namespace){
        exceeded
        exceededQuotas{
          quotaName
          resourceName
          affectedResources
        }
      }
    }`;

    const variables = {
      namespace
    };

    return this.graphQLClientService.gqlQuery(query, variables);
  }
}
