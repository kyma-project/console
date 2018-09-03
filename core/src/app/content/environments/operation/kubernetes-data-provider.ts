import { HttpClient } from '@angular/common/http';
import { List } from '../../../shared/datamodel/k8s/generic/list';
import { Environment } from '../../../shared/datamodel/k8s/environment';
import {
  DataProvider,
  SimpleFilterMatcher,
  SimpleFacetMatcher,
  DataConverter,
  Filter,
  Facet,
  DataProviderResult
} from '@kyma-project/y-generic-list';
import { Observable } from 'rxjs';
import { catchError, map, publishReplay, refCount } from 'rxjs/operators';

export class KubernetesDataProvider<S extends any, T extends any>
  implements DataProvider {
  filterMatcher = new SimpleFilterMatcher();
  facetMatcher = new SimpleFacetMatcher();
  observableDataSource: any;

  constructor(
    private resourceUrl: string,
    private dataConverter: DataConverter<S, T>,
    private http: HttpClient,
    private dashboardApiResource?: string
  ) {}

  getData(
    pageNumber: number,
    pageSize: number,
    filters: Filter[],
    facets: string[],
    noCache?: boolean
  ): Observable<DataProviderResult> {
    return Observable.create(observer => {
      if (noCache || this.observableDataSource === undefined) {
        this.observableDataSource = this.http
          .get<List<S>>(this.resourceUrl)
          .pipe(
            map(res => {
              const resourcesList = this.extractResourcesList(res);

              return resourcesList
                .map(item => {
                  return this.dataConverter
                    ? this.dataConverter.convert(item)
                    : item;
                })
                .filter(item => this.selectActiveEnvironments(item));
            }),
            catchError(error => {
              observer.error(error);
              throw error;
            }),
            publishReplay(1),
            refCount()
          );
      }

      this.observableDataSource.subscribe(res => {
        const filteredData = this.filterMatcher.filter(
          res as T[],
          filters
        ) as T[];
        const facetedData = this.facetMatcher.filter(
          filteredData,
          facets,
          entry => (entry.getLabels ? entry.getLabels() : '')
        ) as T[];
        const index = pageSize * (pageNumber - 1);
        const pagedData = facetedData.slice(index, index + pageSize);
        observer.next(
          new DataProviderResult(
            pagedData,
            facetedData.length,
            this.collectFacets(res as any[])
          )
        );
        observer.complete();
      });
    });
  }

  collectFacets(data: T[]): Facet[] {
    const facetMap = {};
    data.forEach(entry => {
      const labels = entry.getLabels ? entry.getLabels() : '';
      if (labels) {
        labels.forEach(label => {
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

  extractResourcesList(res) {
    return this.dashboardApiResource
      ? res[this.dashboardApiResource]
      : res.items;
  }

  selectActiveEnvironments(item) {
    if (item instanceof Environment) {
      return (
        !item.status || !item.status.phase || item.status.phase === 'Active'
      );
    } else {
      return true;
    }
  }
}
