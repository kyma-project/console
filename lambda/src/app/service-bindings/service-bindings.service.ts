import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { AppConfig } from '../app.config';
import {
  ServiceBinding,
  IServiceBinding,
  IServiceBindingSpec,
} from '../shared/datamodel/k8s/service-binding';
import { Observable } from 'rxjs';
import { IMetaData } from '../shared/datamodel/k8s/generic/meta-data';
import { LocalObjectReference } from '../shared/datamodel/k8s/local-object-reference';
import { ServiceBindingList } from '../shared/datamodel/k8s/service-binding-list';
import { Secret } from '../shared/datamodel/k8s/secret';

@Injectable()
export class ServiceBindingsService {
  constructor(private http: HttpClient) {}

  public getServiceBinding(
    name: string,
    namespace: string,
    token: string,
  ): Observable<ServiceBinding> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${
      AppConfig.serviceCatalogApiUrl
    }/namespaces/${namespace}/servicebindings/${name}`;
    return this.http.get<ServiceBinding>(url, httpOptions);
  }

  public getServiceBindings(
    namespace: string,
    token: string,
  ): Observable<ServiceBindingList> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${
      AppConfig.serviceCatalogApiUrl
    }/namespaces/${namespace}/servicebindings`;
    return this.http.get<ServiceBindingList>(url, httpOptions);
  }

  public createServiceBinding(
    serviceBinding: ServiceBinding,
    token: string,
  ): Observable<ServiceBinding> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.serviceCatalogApiUrl}/namespaces/${
      serviceBinding.metadata.namespace
    }/servicebindings`;
    return this.http.post<ServiceBinding>(url, serviceBinding, httpOptions);
  }

  public deleteServiceBinding(
    name: string,
    namespace: string,
    token: string,
  ): Observable<ServiceBinding> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${
      AppConfig.serviceCatalogApiUrl
    }/namespaces/${namespace}/servicebindings/${name}`;
    return this.http.delete<ServiceBinding>(url, httpOptions);
  }

  initializeServiceBinding(): ServiceBinding {
    const md: IMetaData = {
      name: '',
      namespace: '',
    };
    const lor: LocalObjectReference = {
      name: '',
    };
    const sp: IServiceBindingSpec = {
      instanceRef: lor,
      secretName: '',
    };

    const serviceBinding = new ServiceBinding({
      kind: 'ServiceBinding',
      apiVersion: 'servicecatalog.k8s.io/v1beta1',
      metadata: md,
      spec: sp,
    });
    return serviceBinding;
  }

  getHTTPOptions(token: string): object {
    let httpHeaders: any;
    httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return httpHeaders;
  }
}
