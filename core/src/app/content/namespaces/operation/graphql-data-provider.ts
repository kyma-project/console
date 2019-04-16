import {
  DataProvider,
  DataProviderResult,
  SimpleFacetMatcher,
  SimpleFilterMatcher,
  Facet,
  Filter
} from 'app/generic-list';
import { Observable, pipe } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export class GraphQLDataProvider implements DataProvider {
  filterMatcher = new SimpleFilterMatcher();
  facetMatcher = new SimpleFacetMatcher();
  queryCache: any; 

  constructor(
    private query: string,
    private variables: object,
    private apollo: Apollo,
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
      if(!this.subscriptions || ! this.resourceKind) {
        if (noCache || !this.queryCache) {
          if(!this.queryCache){
            this.queryCache = this.apollo
            .watchQuery({query: gql`${this.query}`, variables: this.variables})
          } else {
            this.queryCache.resetLastResults();
            this.queryCache.refetch();
          }
        };
      } else {
        this.queryCache = this.apollo
        .watchQuery({query: gql`${this.query}`, variables: this.variables});
        this.queryCache.subscribeToMore({
          document: gql`${this.subscriptions}`,
          variables: this.variables,
          updateQuery: (prev, {subscriptionData}) => {
            if (!subscriptionData || !subscriptionData.data) {
              return prev;
            };
            const lowerCaseResourceKind = this.resourceKind.charAt(0).toLowerCase() + this.resourceKind.slice(1);
            const currentItems = prev[`${lowerCaseResourceKind}s`];
            let result;
            const item = subscriptionData.data[`${lowerCaseResourceKind}Event`][lowerCaseResourceKind];
            const type = subscriptionData.data[`${lowerCaseResourceKind}Event`].type;
            if (type === 'DELETE') {
              result = currentItems.filter(i => i.name !== item.name);
            } else if (type === 'UPDATE') {
              const idx = currentItems.findIndex(i => i.name === item.name);
                currentItems[idx] = item;
                result = currentItems;
            } else if (type === 'ADD') {
              const idx = currentItems.findIndex(i => i.name === item.name);
              if(idx === -1) {
                result = [...currentItems, item];
              } else {
                currentItems[idx] = item;
                result = currentItems;
              }
            }
            return prev[`${lowerCaseResourceKind}s`] = result;
          }
        });
      }

      this.queryCache.valueChanges
      .subscribe(
        res => {
          res = res.data;
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
}
