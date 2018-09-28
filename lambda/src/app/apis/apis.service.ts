import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { Api, IApiSpec } from '../shared/datamodel/k8s/api';
import { Observable } from 'rxjs/Observable';
import { IMetaData } from '../shared/datamodel/k8s/generic/meta-data';
import { Service } from '../shared/datamodel/k8s/api-service';
import { AuthenticationRule } from '../shared/datamodel/k8s/api-authentication-rule';
import { JwtAuthentication } from '../shared/datamodel/k8s/api-jwt-authentication';
import { Lambda } from '../shared/datamodel/k8s/function';

@Injectable()
export class ApisService {
  constructor(private http: HttpClient) {}

  public getApi(
    name: string,
    namespace: string,
    token: string,
  ): Observable<Api> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.apisApiUrl}/namespaces/${namespace}/apis/${name}`;
    return this.http.get<Api>(url, httpOptions);
  }

  public createApi(
    api: Api,
    namespace: string,
    token: string,
  ): Observable<Api> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.apisApiUrl}/namespaces/${namespace}/apis/${
      api.metadata.name
    }`;
    return this.http.post<Api>(url, api, httpOptions);
  }

  public updateApi(
    api: Api,
    namespace: string,
    token: string,
  ): Observable<Api> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.apisApiUrl}/namespaces/${namespace}/apis/${
      api.metadata.name
    }`;
    return this.http.put<Api>(url, api, httpOptions);
  }

  public deleteApi(
    name: string,
    namespace: string,
    token: string,
  ): Observable<Api> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.apisApiUrl}/namespaces/${namespace}/apis/${name}`;
    return this.http.delete<Api>(url, httpOptions);
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

  initializeApi(
    lambda: Lambda,
    namespace: string,
    existingApi: Api,
    isAuthenticated: boolean,
    url: string,
    authType: string,
    jwksUri: string,
    issuer: string,
  ): Api {
    const md: IMetaData = {
      name: lambda.metadata.name,
      namespace: name,
      resourceVersion:
        existingApi !== undefined && existingApi != null
          ? existingApi.metadata.resourceVersion
          : '',
      labels: {
        function: lambda.metadata.name,
      },
    };

    const svc: Service = {
      name: lambda.metadata.name,
      port: 8080,
    };

    // api-controller cannot resolve kyma.local in local installation
    const localDomainJwksUri =
      AppConfig.domain === 'kyma.local'
        ? 'http://dex-service.kyma-system.svc.cluster.local:5556/keys'
        : `https://dex.${AppConfig.domain}/keys`;

    const jwtAuthentication: JwtAuthentication = {
      issuer:
        issuer !== undefined && issuer !== ''
          ? issuer
          : `https://dex.${AppConfig.domain}`,
      jwksUri:
        jwksUri !== undefined && jwksUri !== '' ? jwksUri : localDomainJwksUri,
    };

    const authRule: AuthenticationRule = {
      type: authType !== undefined && authType !== '' ? authType : 'JWT',
      jwt: jwtAuthentication,
    };

    const sp: IApiSpec = {
      service: svc,
      authentication: isAuthenticated ? [authRule] : [],
      hostname: url,
    };

    const api = new Api({
      kind: 'Api',
      apiVersion: 'gateway.kyma.cx/v1alpha2',
      metadata: md,
      spec: sp,
    });
    return api;
  }
}
