import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import {
  IDeployment,
  IDeploymentSpec,
  Deployment,
} from '../../shared/datamodel/k8s/deployment';
import { DeploymentList } from '../../shared/datamodel/k8s/deployment-list';

@Injectable()
export class DeploymentDetailsService {
  constructor(private http: HttpClient) {}

  /** GET deployment by function name and namespace. Will 404 if deployment not found */
  getDeployments(
    name: string,
    namespace: string,
    token: string,
  ): Observable<DeploymentList> {
    const httpOptions = {
      headers: this.getHTTPOptions(token),
      params: new HttpParams().set('labelSelector', `function=${name}`),
    };
    const url = `${AppConfig.k8sApiUrl}/namespaces/${namespace}/deployments`;
    return this.http.get<DeploymentList>(url, httpOptions);
  }

  getHTTPOptions(token: string): HttpHeaders {
    let httpHeaders: any;
    httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return httpHeaders;
  }
}
