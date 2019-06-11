import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';
import { AppConfig } from '../app.config';
import { EventActivation } from '../shared/datamodel/k8s/event-activation';
import { Observable } from 'rxjs';
import { Event } from '../shared/datamodel/event';
import { EventActivationResponse } from '../shared/datamodel/k8s/event-activation-response';
import { Pod } from '../shared/datamodel/k8s/pod';

export interface ITimestampComparable {
  name: string;
  creationTimestamp: number;
}

export interface IContainerInstancesResponse {
  data: {
    pods: ITimestampComparable[];
  };
}

@Injectable()
export class ContainerInstancesService {
  constructor(
    private http: HttpClient,
    private graphQLClientService: GraphqlClientService,
  ) {}

  getContainerInstances(
    namespace: string,
    token: string,
  ): Observable<IContainerInstancesResponse> {
    const query = `query Pod($namespace: String!) {
      pods(namespace: $namespace) {
        name
        creationTimestamp
      }
    }`;
    const variables = { namespace };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables,
      token,
    );
  }
}
