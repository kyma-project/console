import { Facet } from '../filter/Facet';

export class DataProviderResult {
  private _data: any[];
  private _totalCount: number;
  private _facets: Facet[] = [];

  constructor(data, totalCount, facets?) {
    this._data = data;
    this._totalCount = totalCount;
    this._facets = facets;
  }

  get data(): any[] {
    return this._data;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  get facets(): Facet[] {
    return this._facets;
  }
}
