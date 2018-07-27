import { Observable } from 'rxjs/Observable';
import { DataProvider } from './data-provider';
import { DataProviderResult } from './data-provider-result';
import { Filter } from '../filter/Filter';
import { SimpleFilterMatcher } from '../filter/simple-filter-matcher';

export class ArrayDataProvider implements DataProvider {
  data: any[];

  matcher = new SimpleFilterMatcher();

  constructor(data: any[]) {
    this.data = data;
  }

  getData(
    pageNumber: number,
    pageSize: number,
    filters: Filter[]
  ): Observable<DataProviderResult> {
    const filteredData = this.matcher.filter(this.data, filters);
    const index = pageSize * (pageNumber - 1);
    const pagedData = filteredData.slice(index, index + pageSize);

    return Observable.create(observer => {
      observer.next(new DataProviderResult(pagedData, filteredData.length));
      observer.complete();
    });
  }
}
