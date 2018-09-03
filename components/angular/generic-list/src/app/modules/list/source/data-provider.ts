import { Filter } from '../filter/Filter';
import { DataProviderResult } from './data-provider-result';
import { Observable } from 'rxjs';

export interface DataProvider {
  getData(
    pageNumber: number,
    pageSize: number,
    filters: Filter[],
    facets: string[],
    noCache?: boolean,
  ): Observable<DataProviderResult>;
}
