import {
  Component,
  OnChanges,
  OnDestroy,
  SimpleChange,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { ListFilterComponent } from '../list-filter/list-filter.component';

@Component({
  selector: 'y-list-search',
  templateUrl: './list-search.component.html',
  styleUrls: ['./list-search.component.scss']
})
export class ListSearchComponent extends ListFilterComponent implements OnChanges, OnDestroy {
  searching = false;
  searchText: string;
  keyUpSubs: Subscription;

  @ViewChild('searchInput') searchInputElement;

  ngOnDestroy() {
    if (this.keyUpSubs) {
      this.keyUpSubs.unsubscribe();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    super.ngOnChanges(changes);
    for (const propName in changes) {
      if (propName === 'filterState') {
        this.searchText = '';
        if (this.hasSearch()) {
          this.filterState.filters.forEach(filter => {
            if (filter.value && filter.value !== this.searchText) {
              this.searchText += filter.value;
            }
          });
        }
        if (this.searchText) {
          this.searching = true;
        }
      }
    }
  }

  registerKeyupSearch(): void {
    if (!this.searchInputElement || this.keyUpSubs) {
      return;
    }
    this.keyUpSubs = Observable.fromEvent(this.searchInputElement.nativeElement, 'keyup')
      .map(function(e: any) {
        return e.target.value;
      })
      .debounceTime(200) // Only run after specified ms without input
      .distinctUntilChanged() // Only if the value has changed
      .subscribe((value: string) => {
        this.searchText = value;
        this.searchTextChange();
      });
  }

  searchTextChange() {
    if (this.hasSearch()) {
      this.filterState.filters.forEach(filter => {
        filter.value = this.searchText;
      });
    }
    this.filterChange();
  }

  hasSearch() {
    return this.filterState.filters && this.filterState.filters.length > 0;
  }

  openSearch(event) {
    event.stopPropagation();
    this.searching = true;
    setTimeout(() => {
      this.registerKeyupSearch();
      this.searchInputElement.nativeElement.focus();
    });
  }

  closeSearch(event) {
    event.stopPropagation();
    this.searching = false;
    this.searchText = '';
    this.searchInputElement.nativeElement.value = '';
    this.searchTextChange();
  }

  closeIfEmpty() {
    if (!this.searchText) {
        this.searching = false;
    }
  }
}
