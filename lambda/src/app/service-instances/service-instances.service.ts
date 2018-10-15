import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceInstance } from '../shared/datamodel/k8s/service-instance';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { ServiceInstanceList } from '../shared/datamodel/k8s/service-instance-list';

@Injectable()
export class ServiceInstancesService {
  constructor(private http: HttpClient) {}

  public getServiceInstances(
    namespace: string,
    token: string,
  ): Observable<ServiceInstanceList> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${
      AppConfig.serviceCatalogApiUrl
    }/namespaces/${namespace}/serviceinstances`;
    return this.http.get<ServiceInstanceList>(url, httpOptions);
  }

  public getServiceInstance(
    name: string,
    namespace: string,
    token: string,
  ): Observable<ServiceInstance> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${
      AppConfig.serviceCatalogApiUrl
    }/namespaces/${namespace}/serviceinstances/${name}`;
    return this.http.get<ServiceInstance>(url, httpOptions);
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
