import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  Type,
  ViewRef,
} from '@angular/core';
import { DataProvider } from '../source/data-provider';
import { Observable, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'y-generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.scss'],
})
export class GenericListComponent implements OnChanges, OnInit {
  @Input() source: DataProvider;
  @Input() entryRenderer: Type<any>;
  @Input() entryEventHandler;
  @Input() pagingState;
  @Input() filterState;
  @Input() title;
  @Input() emptyListText;
  @Input() createNewElementText;
  @Input() localStorageKey: string;

  data: Observable<any[]>;
  showEmptyPage = false;
  loaded = false;
  loading = false;
  initialized = false;
  searchSubscription: Subscription;
  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.localStorageKey) {
      this.loadFilterFacets();
    }
    this.applyState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyState(true);
  }

  setLoading(status: boolean): void {
    this.loading = status;
  }

  setLoaded(status: boolean): void {
    this.loaded = status;
    if (!this.initialized && status) {
      this.initialized = status;
    }
  }

  onPageChanged(pagingState) {
    this.pagingState.pageNumber = pagingState.pageNumber;
    this.applyState();
  }

  onFilterChanged(filterState) {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.searchSubscription = of(0)
      .pipe(delay(150))
      .subscribe(() => {
        this.filterState = filterState;
        this.pagingState.pageNumber = 1;
        this.applyState();
      });
  }

  reload() {
    this.applyState(true);
  }

  applyState(noCache?: boolean) {
    of(0)
      .pipe(delay(350))
      .subscribe(() => {
        if (!this.loaded) {
          this.setLoading(true);
        }
      });

    if (!this.pagingState) {
      this.pagingState = {
        pageNumber: 1,
        pageSize: 16,
        totalCount: 0,
      };
    }
    if (!this.filterState) {
      this.filterState = {
        filters: [],
        facets: [],
      };
    }

    if (this.source) {
      this.data = new Observable(observer => {
        this.fetchData(observer, noCache, 2);
      });
      this.setLoaded(false);
    } else {
      this.data = null;
      this.setLoaded(true);
    }
    if (!(this.changeDetector as ViewRef).destroyed) {
      this.changeDetector.detectChanges();
    }
  }

  private fetchData(observer, noCache: boolean, retries) {
    this.source
      .getData(
        this.pagingState.pageNumber,
        this.pagingState.pageSize,
        this.filterState.filters,
        this.filterState.facets,
        noCache,
      )
      .subscribe(
        result => {
          if (
            retries > 0 &&
            this.pagingState.pageNumber > 1 &&
            result.totalCount > 0 &&
            (this.pagingState.pageNumber - 1) * this.pagingState.pageSize >=
              result.totalCount
          ) {
            this.pagingState = {
              pageNumber: Math.max(
                1,
                Math.ceil(result.totalCount / this.pagingState.pageSize),
              ),
              pageSize: this.pagingState.pageSize,
              totalCount: result.totalCount,
            };
            this.fetchData(observer, false, retries - 1);
            return;
          }

          this.pagingState = {
            pageNumber: this.pagingState.pageNumber,
            pageSize: this.pagingState.pageSize,
            totalCount: result.totalCount,
          };
          this.filterState = this.updateFilterState(
            this.filterState,
            result.facets,
          );

          this.showEmptyPage =
            0 === result.data.length && !this.filteringActive(this.filterState);

          if (!(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
          }

          observer.next(result.data);
          this.setLoaded(true);
          this.setLoading(false);
        },
        error => {
          this.setLoaded(true);
          this.setLoading(false);
          this.pagingState = {
            pageNumber: this.pagingState.pageNumber,
            pageSize: this.pagingState.pageSize,
            totalCount: 0,
          };
          this.filterState = this.updateFilterState(this.filterState, []);
          if (!(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
          }
          observer.error(error);
        },
      );
  }

  updateFilterState(filterState, availableFacets) {
    let facets = filterState.facets || [];
    if (availableFacets && facets) {
      const availableFacetLabels = [];
      facets.forEach(f => {
        availableFacetLabels.push(f);
      });
      facets = facets.filter(f => {
        return availableFacetLabels.indexOf(f) !== -1;
      });
    }
    return {
      filters: filterState.filters,
      availableFacets,
      facets,
    };
  }

  filteringActive(filterState) {
    if (!filterState) {
      return false;
    }
    let result = false;
    if (filterState.filters) {
      filterState.filters.forEach(filter => {
        if (filter.value) {
          result = true;
        }
      });
    }
    if (filterState.facets && filterState.facets.length > 0) {
      result = true;
    }
    return result;
  }

  createNewElement() {
    // TODO
  }

  protected loadFilterFacets() {
    const stringFacets = localStorage.getItem(this.localStorageKey);
    if (!stringFacets) {
      return;
    }
    const facets = JSON.parse(stringFacets);
    if (!facets) {
      return;
    }
    this.filterState.facets = facets;
  }

}
