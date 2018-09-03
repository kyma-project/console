import { AppConfig } from '../../../app.config';
import { Injectable, EventEmitter } from '@angular/core';
import { EnvironmentInfo } from '../environment-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EnvironmentsService {
  public envChangeStateEmitter$: EventEmitter<boolean>;

  constructor(private http: HttpClient) {
    this.envChangeStateEmitter$ = new EventEmitter();
  }

  public getEnvironments(): Observable<EnvironmentInfo[]> {
    return this.http
      .get<any>(AppConfig.k8sApiServerUrl + 'namespaces?labelSelector=env=true')
      .pipe(
        map(
          response => {
            const environments: EnvironmentInfo[] = [];

            if (response.items) {
              response.items.forEach(namespace => {
                if (namespace.status.phase === 'Active') {
                  environments.push(
                    new EnvironmentInfo(
                      namespace.metadata.uid,
                      namespace.metadata.name
                    )
                  );
                }
              });
            }
            return environments;
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

  public createEnvironment(environmentName: string) {
    const body = {
      metadata: { name: environmentName, labels: { env: 'true' } }
    };
    if (environmentName) {
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

  public deleteEnvironment(environmentName: string) {
    if (environmentName) {
      return this.http
        .delete(`${AppConfig.k8sApiServerUrl}namespaces/${environmentName}`)
        .pipe(
          map(response => {
            this.envChangeStateEmitter$.emit(true);
            return response;
          })
        );
    }
  }
}
