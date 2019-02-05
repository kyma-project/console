import { Component, OnChanges, SimpleChange } from '@angular/core';
import { ListFilterComponent } from '../list-filter/list-filter.component';

@Component({
  selector: 'y-list-search',
  templateUrl: './list-search.component.html',
  styleUrls: ['./list-search.component.scss'],
})
export class ListSearchComponent extends ListFilterComponent
  implements OnChanges {
  searching = false;
  searchText = '';

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
      }
    }
  }

  searchTextChange(text) {
    this.searchText = text;
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
      const searchInput = document.querySelector(
        '.search input[type="search"]',
      ) as HTMLElement;
      if (searchInput && typeof searchInput.focus === 'function') {
        searchInput.focus();
      }
    });
  }

  closeIfEmpty() {
    if (!this.searchText) {
      this.searching = false;
    }
  }
}
