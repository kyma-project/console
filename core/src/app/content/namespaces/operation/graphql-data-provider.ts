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
    private url: string,
    private query: string,
    private variables: object,
    private apollo: Apollo
  ) {}

  getData(
    pageNumber: number,
    pageSize: number,
    filters: Filter[],
    facets: string[],
    noCache?: boolean
  ): Observable<DataProviderResult> {
    return new Observable(observer => {
      if (noCache || !this.queryCache) {
        this.queryCache = this.apollo
          .watchQuery({query: gql`${this.query}`, variables: this.variables});
      } 
      this.queryCache.valueChanges
        .pipe(
          publishReplay(1),
          refCount()
        )
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
