import { AppConfig } from '../../../app.config';
import { Injectable, EventEmitter } from '@angular/core';
import { NamespaceInfo } from '../namespace-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';

@Injectable()
export class NamespacesService {
  public namespaceChangeStateEmitter$: EventEmitter<boolean>;

  constructor(
    private http: HttpClient,
    private graphQLClientService: GraphQLClientService
  ) {
    this.namespaceChangeStateEmitter$ = new EventEmitter();
  }

  public getNamespaces(): Observable<NamespaceInfo[]> {
    return this.http
      .get<any>(AppConfig.k8sApiServerUrl + 'namespaces?labelSelector=env=true')
      .pipe(
        map(
          response => {
            const namespaces: NamespaceInfo[] = [];

            if (response.items) {
              response.items.forEach(namespace => {
                if (namespace.status.phase === 'Active') {
                  namespaces.push(
                    new NamespaceInfo(
                      namespace.metadata.uid,
                      namespace.metadata.name
                    )
                  );
                }
              });
            }
            return namespaces;
          },
          err => console.log(err)
        )
      );
  }

  public getNamespace(id: string): Observable<NamespaceInfo> {
    return this.http
      .get<any>(AppConfig.k8sApiServerUrl + 'namespaces/' + id)
      .pipe(
        map(response => {
          if (!_.isEmpty(response.metadata)) {
            return new NamespaceInfo(
              response.metadata.uid,
              response.metadata.name
            );
          }
          return response;
        })
      );
  }

  public createNamespace(name: string, labels: object) {
    const mutation = `mutation CreateNamespace($name: String!, $labels: Labels) {
      createNamespace(name: $name, labels: $labels){
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
        limits {
          memory
        }
        requests {
          memory
        }
      } 
    }`;

    const variables = {
      namespace,
      name: `${namespace}-resource-quota`,
      resourceQuota
    };

    return this.graphQLClientService.gqlMutation(mutation, variables);
  }

  public deleteNamespace(namespaceName: string) {
    if (namespaceName) {
      return this.http
        .delete(`${AppConfig.k8sApiServerUrl}namespaces/${namespaceName}`)
        .pipe(
          map(response => {
            this.namespaceChangeStateEmitter$.emit(true);
            return response;
          })
        );
    }
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
