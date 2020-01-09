import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';

@Injectable()
export class TriggersService {

  constructor(private http: HttpClient) {}

  public getTriggersForLambda(
    namespace: string,
    token: string,
    lambdaName: string,
  ): Observable<any> {

    const url = `${
      AppConfig.triggerApiUrl
    }/namespaces/${namespace}/triggers`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      params: {labelSelector: `Function=${lambdaName}`},
    });
  }

  initializeTrigger() {
    return {
      apiVersion : 'eventing.knative.dev/v1alpha1',
      kind: 'Trigger',
      metadata : {
        labels : {}
      },
      spec : {
        broker: 'default',
        filter: {
          attributes:{}
        },
        subscriber: {}
      }
    }
  }

  createTrigger(kTrigger: any, token: string): Observable<any> {
    const url = `${AppConfig.triggerApiUrl}/namespaces/${
      kTrigger.metadata.namespace
    }/triggers`;
    return this.http.post<any>(url, kTrigger, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })
    });
  }

  deleteTrigger(name: string, namespace: string, token: string): Observable<any> {
    const url = `${
      AppConfig.triggerApiUrl
    }/namespaces/${namespace}/triggers/${name}`;
    return this.http.delete<any>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })
    });
  }
}
