import {
  DataProvider,
  DataProviderResult,
  SimpleFacetMatcher,
  SimpleFilterMatcher,
  Facet,
  Filter
} from 'app/generic-list';
import { Observable, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { catchError, map } from 'rxjs/operators';

export class GraphQLDataProvider implements DataProvider {
  filterMatcher = new SimpleFilterMatcher();
  facetMatcher = new SimpleFacetMatcher();
  resourceQuery: any; 

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
      if(!this.subscriptions || ! this.resourceKind || !this.resourceQuery) {
        if(!this.resourceQuery){
          this.resourceQuery = this.apollo
          .watchQuery({query: gql`${this.query}`, variables: this.variables, fetchPolicy: 'no-cache'})
        } else {
          this.resourceQuery.resetLastResults();
          this.resourceQuery.refetch();
        };
      } else {
        this.resourceQuery = this.apollo
        .watchQuery({query: gql`${this.query}`, variables: this.variables});
        this.resourceQuery.subscribeToMore({
          document: gql`${this.subscriptions}`,
          variables: this.variables,
          updateQuery: (prev, {subscriptionData}) => {
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
              // Sometimes the 'ADD' event is not received
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

      this.resourceQuery.valueChanges
      .pipe(
        map(res => {
          return this.processResponse(res);
        }),
        catchError(err => {
          return this.processError(err);
        })
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

  processResponse(res) {
    const response: any = res;
    const filteredErrors =
      (response &&
        response.errors &&
        response.errors.filter(
          (e: any) => !e.message.startsWith('MODULE_DISABLED')
        )) ||
      [];
    if (filteredErrors.length) {
      return throwError(filteredErrors[0].message);
    } else if (response && response.data) {
      return response.data;
    }
  }

  processError(err) {
    let error;
    if (err.error && err.error.errors) {
      error = err.error.errors[0].message;
    } else if (err.error && err.error.message) {
      error = err.error.message;
    }
    error = error || err.message || err;
    return throwError(error);
  }
}
