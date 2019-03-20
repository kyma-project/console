import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../../../../../app.config';

@Injectable()
export class ExposeApiService {
  constructor(private httpClient: HttpClient) {}

  createApiDefinition(url, data) {
    return this.httpClient.post<any>(
      `${AppConfig.k8sApiServerUrl_apimanagement}${url}`,
      data,
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  updateApiDefinition(url, data) {
    return this.httpClient.put<any>(
      `${AppConfig.k8sApiServerUrl_apimanagement}${url}`,
      data,
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  deleteApiDefinition(url) {
    return this.httpClient.delete<any>(
      `${AppConfig.k8sApiServerUrl_apimanagement}${url}`
    );
  }

  getApiDefinition(url) {
    return this.httpClient.get<any>(
      `${AppConfig.k8sApiServerUrl_apimanagement}${url}`
    );
  }

  getService(namespace: string, serviceName: string) {
    return this.httpClient.get<any>(
      `${
        AppConfig.k8sApiServerUrl
      }namespaces/${namespace}/services/${serviceName}`
    );
  }

  getListOfServices(namespace: string) {
    return this.httpClient.get<any>(
      `${AppConfig.k8sApiServerUrl}namespaces/${namespace}/services`
    );
  }

  getPodsByLabelSelector(namespace: string, labels: string) {
    return this.httpClient.get<any>(
      `${
        AppConfig.k8sApiServerUrl
      }namespaces/${namespace}/pods?labelSelector=${labels}`
    );
  }

  prepareApiDefinitionToCreate(data) {
    const result = {
      kind: 'Api',
      metadata: {
        name: data.apiName
      },
      apiVersion: `gateway.kyma-project.io/${
        AppConfig.gateway_kyma_project_io_version
      }`,
      spec: {
        service: {
          name: data.serviceName,
          port: data.servicePort
        },
        hostname: data.hostname
      }
    };
    if (data.authentication) {
      result.spec['authentication'] = data.authentication;
    }
    return result;
  }

  prepareApiDefinitionToUpdate(apiDefinition, data) {
    apiDefinition.spec.service.port = data.servicePort;
    apiDefinition.spec.hostname = data.hostname;
    if (data.authentication) {
      apiDefinition.spec.authentication = data.authentication;
    } else if (apiDefinition.spec.authentication) {
      delete apiDefinition.spec.authentication;
    }
    return apiDefinition;
  }
}
