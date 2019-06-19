import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class PodsSubscriptonService {
  constructor(private apollo: Apollo) {}

  private podQuery = gql`
    query Pod($namespace: String!) {
      pods(namespace: $namespace) {
        name
        labels
      }
    }
  `;

  private podSubscription = gql`
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
  private resourceQuery: QueryRef<any>;

  private updateSubscriptions(prev, subscriptionData) {
    if (!subscriptionData || !subscriptionData.data) {
      return prev;
    }
    const currentItems = prev.pods;
    const item = subscriptionData.data.podEvent.pod;
    const type = subscriptionData.data.podEvent.type;
    let result;

    if (type === 'DELETE') {
      result = currentItems.filter(i => i.name !== item.name);
    } else if (type === 'UPDATE' || type === 'ADD') {
      // Sometimes we receive the 'UPDATE' event instead of 'ADD'
      const index = currentItems.findIndex(i => i.name === item.name);
      if (index === -1) {
        result = [...currentItems, item];
      } else {
        currentItems[index] = item;
        result = currentItems;
      }
    } else {
      result = currentItems;
    }

    return {
      ...prev,
      pods: result,
    };
  }

  public getAllPods(namespace: string): QueryRef<any> {
    if (!this.apollo.getClient()) {
      console.warn(`Apollo client has not been initialized yet`);
      return null;
    }
    this.resourceQuery = this.apollo.watchQuery({
      query: this.podQuery,
      variables: { namespace },
      fetchPolicy: 'network-only',
    });

    this.resourceQuery.subscribeToMore({
      document: this.podSubscription,
      variables: { namespace },
      updateQuery: (prev, { subscriptionData }) => {
        return this.updateSubscriptions(prev, subscriptionData);
      },
    });

    return this.resourceQuery;
  }
}
