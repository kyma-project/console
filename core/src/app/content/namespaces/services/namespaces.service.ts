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

  public createNamespace(namespaceName: string) {
    const body = {
      metadata: { name: namespaceName, labels: { env: 'true' } }
    };
    if (namespaceName) {
      return this.http
        .post<any>(`${AppConfig.k8sApiServerUrl}namespaces`, body, {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
        })
        .pipe(
          map(response => {
            if (!_.isEmpty(response.metadata)) {
              this.namespaceChangeStateEmitter$.emit(true);
              return response;
            }
            return response;
          })
        );
    }
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
