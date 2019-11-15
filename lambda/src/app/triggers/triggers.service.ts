import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {
//   Subscription,
//   ISubscriptionList,
//   ISubscription,
//   ISubscriptionSpec,
// } from '../shared/datamodel/k8s/subscription';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
// import { IMetaData } from '../shared/datamodel/k8s/generic/meta-data';

@Injectable()
export class TriggersService {

  constructor(private http: HttpClient) {}

  initializeTrigger() {
    return {
      apiVersion : 'eventing.knative.dev/v1alpha1',
      kind: 'Trigger',
      metadata : {},
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
