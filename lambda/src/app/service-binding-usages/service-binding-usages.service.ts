import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ServiceBindingUsage,
  IServiceBindingUsage,
  IServiceBindingUsageSpec,
  ILocalReferenceByName,
  ILocalReferenceByKindAndName,
  IServiceBindingUsageList,
  ILocalEnvPrefix,
  ILocalParams,
} from '../shared/datamodel/k8s/service-binding-usage';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { IMetaData } from '../shared/datamodel/k8s/generic/meta-data';

@Injectable()
export class ServiceBindingUsagesService {
  constructor(private http: HttpClient) {}

  public createServiceBindingUsage(
    serviceBindingUsage: ServiceBindingUsage,
    token: string,
  ): Observable<ServiceBindingUsage> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.serviceBindingUsageUrl}/namespaces/${
      serviceBindingUsage.metadata.namespace
    }/servicebindingusages`;
    return this.http.post<ServiceBindingUsage>(
      url,
      serviceBindingUsage,
      httpOptions,
    );
  }

  public deleteServiceBindingUsage(
    name: string,
    namespace: string,
    token: string,
  ): Observable<ServiceBindingUsage> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${
      AppConfig.serviceBindingUsageUrl
    }/namespaces/${namespace}/servicebindingusages/${name}`;
    return this.http.delete<ServiceBindingUsage>(url, httpOptions);
  }

  public getServiceBindingUsages(
    namespace: string,
    token: string,
    params: object = {},
  ): Observable<IServiceBindingUsageList> {
    const httpOptions = this.getHTTPOptions(token, params);
    const url = `${
      AppConfig.serviceBindingUsageUrl
    }/namespaces/${namespace}/servicebindingusages`;
    return this.http.get<IServiceBindingUsageList>(url, httpOptions);
  }

  getHTTPOptions(token: string, parameters: object = {}): object {
    let httpHeaders: any;
    httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
      params: parameters,
    };
    return httpHeaders;
  }

  initializeServiceBindingUsage(): ServiceBindingUsage {
    const md: IMetaData = {
      name: '',
      namespace: '',
    };
    const sbName: ILocalReferenceByName = {
      name: '',
    };
    const ub: ILocalReferenceByKindAndName = {
      name: '',
      kind: '',
    };
    const prefix: ILocalEnvPrefix = {
      name: '',
    };
    const params: ILocalParams = {
      envPrefix: prefix,
    };
    const sp: IServiceBindingUsageSpec = {
      serviceBindingRef: sbName,
      usedBy: ub,
      parameters: params,
    };
    const serviceBindingUsage = new ServiceBindingUsage({
      kind: 'ServiceBindingUsage',
      apiVersion: 'servicecatalog.kyma.cx/v1alpha1',
      metadata: md,
      spec: sp,
    });
    return serviceBindingUsage;
  }
}
