import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';
import { ServiceInstance } from '../shared/datamodel/k8s/service-instance';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { ServiceInstanceResponse } from '../shared/datamodel/k8s/service-instance-response';
import { ServiceInstancesResponse } from '../shared/datamodel/k8s/service-instances-response';

@Injectable()
export class ServiceInstancesService {
  constructor(
    private http: HttpClient,
    private graphQLClientService: GraphqlClientService,
  ) {}

  public getServiceInstances(
    namespace: string,
    token: string,
    status?: string,
  ): Observable<ServiceInstancesResponse> {
    const query = `query ServiceInstances($environment: String!, $status: InstanceStatusType){
      serviceInstances(environment: $environment, status: $status) {
        name,
        bindable
      }}`;
    const variables = { environment: namespace, status };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables,
      token,
    );
  }

  public getServiceInstance(
    name: string,
    namespace: string,
    token: string,
  ): Observable<ServiceInstanceResponse> {
    const query = `query ServiceInstance($name: String!, $environment: String!){
      serviceInstance(name: $name, environment: $environment) {
        name,
        bindable
      }}`;
    const variables = { name, environment: namespace };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables,
      token,
    );
  }
}
