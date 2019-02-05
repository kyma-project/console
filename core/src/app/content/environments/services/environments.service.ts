import { AppConfig } from '../../../app.config';
import { Injectable, EventEmitter } from '@angular/core';
import { EnvironmentInfo } from '../environment-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';

@Injectable()
export class EnvironmentsService {
  public envChangeStateEmitter$: EventEmitter<boolean>;

  constructor(
    private http: HttpClient,
    private graphQLClientService: GraphQLClientService
  ) {
    this.envChangeStateEmitter$ = new EventEmitter();
  }

  public getEnvironments(): Observable<EnvironmentInfo[]> {
    return this.http
      .get<any>(AppConfig.k8sApiServerUrl + 'namespaces?labelSelector=env=true')
      .pipe(
        map(
          response => {
            const namespaces: EnvironmentInfo[] = [];

            if (response.items) {
              response.items.forEach(namespace => {
                if (namespace.status.phase === 'Active') {
                  namespaces.push(
                    new EnvironmentInfo(
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

  public getEnvironment(id: string): Observable<EnvironmentInfo> {
    return this.http
      .get<any>(AppConfig.k8sApiServerUrl + 'namespaces/' + id)
      .pipe(
        map(response => {
          if (!_.isEmpty(response.metadata)) {
            return new EnvironmentInfo(
              response.metadata.uid,
              response.metadata.name
            );
          }
          return response;
        })
      );
  }

  public createEnvironment(namespaceName: string) {
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
              this.envChangeStateEmitter$.emit(true);
              return response;
            }
            return response;
          })
        );
    }
  }

  public deleteEnvironment(namespaceName: string) {
    if (namespaceName) {
      return this.http
        .delete(`${AppConfig.k8sApiServerUrl}namespaces/${namespaceName}`)
        .pipe(
          map(response => {
            this.envChangeStateEmitter$.emit(true);
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

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables
    );
  }
}
