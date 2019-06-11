import { Injectable } from '@angular/core';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';
import { AppConfig } from '../app.config';
import { Observable } from 'rxjs';

export interface ITimestampComparablePod {
  name: string;
  status: string;
  labels: { function: string };
}

export interface IContainerInstancesResponse {
  data: {
    pods: ITimestampComparablePod[];
  };
}

@Injectable()
export class ContainerInstancesService {
  constructor(private graphQLClientService: GraphqlClientService) {}

  getContainerInstances(
    namespace: string,
    token: string,
  ): Observable<IContainerInstancesResponse> {
    const query = `query Pod($namespace: String!) {
      pods(namespace: $namespace) {
        name
        status
        labels
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
