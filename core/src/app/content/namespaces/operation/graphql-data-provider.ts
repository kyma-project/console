import {
  DataProvider,
  DataProviderResult,
  SimpleFacetMatcher,
  SimpleFilterMatcher,
  Facet,
  Filter
} from 'app/generic-list';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { catchError, map } from 'rxjs/operators';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { QueryRef } from 'apollo-angular';

export class GraphQLDataProvider implements DataProvider {
  filterMatcher = new SimpleFilterMatcher();
  facetMatcher = new SimpleFacetMatcher();
  resourceQuery: QueryRef<any>;

  constructor(
    private query: string,
    private variables: object,
    private graphQLClientService: GraphQLClientService,
    private subscriptions?: string,
    private resourceKind?: string
  ) {}

  getData(
    pageNumber: number,
    pageSize: number,
    filters: Filter[],
    facets: string[],
    noCache?: boolean
  ): Observable<DataProviderResult> {
    return new Observable(observer => {
      if(!this.subscriptions || !this.resourceKind) {
        if(noCache || !this.resourceQuery) {
          this.resourceQuery = this.graphQLClientService.gqlWatchQuery(this.query, this.variables, false);
        }
      } else {
        this.resourceQuery = this.graphQLClientService.gqlWatchQuery(this.query, this.variables, true);
        this.resourceQuery.subscribeToMore({
          document: gql`${this.subscriptions}`,
          variables: this.variables,
          updateQuery: (prev, {subscriptionData}) => {
            return this.updateSubscriptions(prev, subscriptionData);
          }
        });
      }

      this.resourceQuery.valueChanges
      .pipe(
        map(res => this.graphQLClientService.processResponse(res)),
        catchError(err => this.graphQLClientService.processError(err))
      )
      .subscribe(
        res => {
          const elementsKey = Object.keys(res)[0];
          const elements = res[elementsKey];

          const filteredData = this.filterMatcher.filter(elements, filters);
          const facetedData = this.facetMatcher.filter(
            filteredData,
            facets,
            entry => {
              const labels = [];
              if (entry.labels) {
                Object.getOwnPropertyNames(entry.labels).map(key => {
                  const label = key + '=' + entry.labels[key];
                  if (label.startsWith('pod-template-hash')) {
                    return;
                  }
                  labels.push(label);
                });
              }
              return labels;
            }
          );
          const index = pageSize * (pageNumber - 1);
          const pagedData = facetedData.slice(index, index + pageSize);
          
          observer.next(
            new DataProviderResult(
              pagedData,
              facetedData.length,
              this.collectFacets(elements)
            )
          );
        },
        err => {
          observer.error(err);
        }
      );
    });
  }

  collectFacets(data: any[]): Facet[] {
    const facetMap = {};
    data.forEach(entry => {
      const labels = entry.labels;
      if (labels) {
        Object.getOwnPropertyNames(labels).map(key => {
          const label = key + '=' + labels[key];
          if (label.startsWith('pod-template-hash')) {
            return;
          }
          if (!facetMap[label]) {
            facetMap[label] = 0;
          }
          facetMap[label]++;
        });
      }
    });
    const result = [] as Facet[];
    Object.getOwnPropertyNames(facetMap).map(key => {
      result.push(new Facet(key, facetMap[key]));
    });
    return result;
  }

  updateSubscriptions(prev, subscriptionData) {
    if (!subscriptionData || !subscriptionData.data) {
      return prev;
    };
    
    const lowerCaseResourceKind = this.resourceKind.charAt(0).toLowerCase() + this.resourceKind.slice(1);
    const currentItems = prev[`${lowerCaseResourceKind}s`];
    const item = subscriptionData.data[`${lowerCaseResourceKind}Event`][lowerCaseResourceKind];
    const type = subscriptionData.data[`${lowerCaseResourceKind}Event`].type;
    let result;

    if (type === 'DELETE') {
      result = currentItems.filter(i => i.name !== item.name);
    } else if (type === 'UPDATE' || type === 'ADD') {
      // Sometimes we receive the 'UPDATE' event instead of 'ADD'
      const index = currentItems.findIndex(i => i.name === item.name);
      if(index === -1) {
        result = [...currentItems, item];
      } else {
        currentItems[index] = item;
        result = currentItems;
      }
    } else {
      result = currentItems;
    }
    
    const resultObject = {[`${lowerCaseResourceKind}s`]: result};
    return resultObject;
  }

}
