import { Injectable } from '@angular/core';
import { Subscription } from 'apollo-angular';
import gql from 'graphql-tag';
import { Query } from 'apollo-angular';

export interface IPod {
  name: string;
  labels: any;
}
export interface IPodQueryResponse {
  data: {
    pods: IPod[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class GetPodsSubscription extends Subscription {
  document = gql`
    subscription Pod($namespace: String!) {
      podEvent(namespace: $namespace) {
        pod {
          name
          labels
        }
        type
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetPodsQuery extends Query<IPodQueryResponse> {
  document = gql`
    query Pod($namespace: String!) {
      pods(namespace: $namespace) {
        name
        labels
      }
    }
  `;
}
