import { refCount, publishReplay, catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  DataConverter,
  DataProviderResult,
  Filter,
  DataProvider,
  Facet,
  SimpleFacetMatcher,
  SimpleFilterMatcher,
} from '@kyma-project/y-generic-list';
import { List } from '../datamodel/list';
import { IMetaDataOwner } from '../datamodel/k8s/generic/meta-data-owner';

export class KubernetesDataProvider<
  S extends IMetaDataOwner,
  T extends IMetaDataOwner
> implements DataProvider {
  filterMatcher = new SimpleFilterMatcher();
  facetMatcher = new SimpleFacetMatcher();
  observableDataSource: any;

  constructor(
    private resourceUrl: string,
    private dataConverter: DataConverter<S, T>,
    private http: HttpClient,
    private token: string,
  ) {}

  getData(
    pageNumber: number,
    pageSize: number,
    filters: Filter[],
    facets: string[],
    noCache?: boolean,
  ): Observable<DataProviderResult> {
    return Observable.create(observer => {
      if (noCache || this.observableDataSource === undefined) {
        this.observableDataSource = this.http
          .get<List<S>>(this.resourceUrl, {
            headers: new HttpHeaders().set(
              'Authorization',
              `Bearer ${this.token}`,
            ),
          })
          .pipe(
            map(res => {
              return res.items.map(item => {
                return this.dataConverter
                  ? this.dataConverter.convert(item)
                  : item;
              });
            }),
            catchError(error => {
              observer.error(error);
              throw error;
            }),
            publishReplay(1),
            refCount(),
          );
      }

      this.observableDataSource.subscribe(res => {
        const filteredData = this.filterMatcher.filter(
          res as T[],
          filters,
        ) as T[];
        const facetedData = this.facetMatcher.filter(
          filteredData,
          facets,
          entry => entry.getLabels(),
        ) as T[];
        const index = pageSize * (pageNumber - 1);
        const pagedData = facetedData.slice(index, index + pageSize);
        observer.next(
          new DataProviderResult(
            pagedData,
            facetedData.length,
            this.collectFacets(res as any[]),
          ),
        );
        observer.complete();
      });
    });
  }

  collectFacets(data: T[]): Facet[] {
    const facetMap = {};
    data.forEach(entry => {
      const labels = entry.getLabels();
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
}
