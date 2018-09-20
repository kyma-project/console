import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Subscription,
  ISubscriptionList,
  ISubscription,
  ISubscriptionSpec,
} from '../shared/datamodel/k8s/subscription';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../app.config';
import { IMetaData } from '../shared/datamodel/k8s/generic/meta-data';

@Injectable()
export class SubscriptionsService {
  constructor(private http: HttpClient) {}

  public createSubscription(
    subscription: Subscription,
    token: string,
  ): Observable<Subscription> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.subscriptionApiUrl}/namespaces/${
      subscription.metadata.namespace
    }/subscriptions`;
    return this.http.post<Subscription>(url, subscription, httpOptions);
  }

  public deleteSubscription(
    name: string,
    namespace: string,
    token: string,
  ): Observable<Subscription> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${
      AppConfig.subscriptionApiUrl
    }/namespaces/${namespace}/subscriptions/${name}`;
    return this.http.delete<Subscription>(url, httpOptions);
  }

  public getSubscriptions(
    namespace: string,
    token: string,
    params: object,
  ): Observable<ISubscriptionList> {
    const httpOptions = this.getHTTPOptions(token, params);
    const url = `${
      AppConfig.subscriptionApiUrl
    }/namespaces/${namespace}/subscriptions`;
    return this.http.get<ISubscriptionList>(url, httpOptions);
  }

  getHTTPOptions(token: string, params: object = {}): object {
    let httpHeaders: any;
    httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      params,
    };
    return httpHeaders;
  }

  initializeSubscription(): Subscription {
    const md: IMetaData = {
      name: '',
      namespace: '',
      labels: {},
    };
    const sp: ISubscriptionSpec = {
      endpoint: '',
      source_id: '',
    };

    const subscription = new Subscription({
      kind: 'Subscription',
      apiVersion: 'eventing.kyma.cx/v1alpha1',
      metadata: md,
      spec: sp,
    });

    subscription.spec['push_request_timeout_ms'] = 2000;
    subscription.spec['max_inflight'] = 400;
    subscription.spec['include_subscription_name_header'] = true;
    subscription.spec['event_type'] = true;
    subscription.spec['event_type_version'] = true;
    return subscription;
  }
}
