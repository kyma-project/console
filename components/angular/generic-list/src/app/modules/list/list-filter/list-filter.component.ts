import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { isArray, isNullOrUndefined } from 'util';
import { Facet } from '../filter/Facet';

@Component({
  selector: 'y-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss'],
})
export class ListFilterComponent implements OnInit, OnChanges {
  @Input() filterState;
  @Output() onFilterChanged = new EventEmitter();

  ariaExpanded = false;
  ariaHidden = true;

  constructor() {}

  ngOnInit() {
    if (!this.filterState) {
      this.filterState = this.createEmptyFilterState();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === 'filterState') {
        if (isNullOrUndefined(this.filterState)) {
          this.filterState = this.createEmptyFilterState();
        }
        this.autoCorrect();
      }
    }
  }

  createEmptyFilterState() {
    return {
      filters: [],
      facets: [],
      availableFacets: [],
    };
  }

  autoCorrect() {
    if (!this.filterState.filters || !isArray(this.filterState.filters)) {
      this.filterState.filters = [];
    }
    if (!this.filterState.facets || !isArray(this.filterState.facets)) {
      this.filterState.facets = [];
    }
    if (
      !this.filterState.availableFacets ||
      !isArray(this.filterState.availableFacets)
    ) {
      this.filterState.availableFacets = [];
    }
    this.filterState.facets.forEach(facet => {
      let found = false;
      this.filterState.availableFacets.forEach(available => {
        if (facet === available.label) {
          found = true;
        }
      });
      if (!found) {
        this.filterState.availableFacets.push(new Facet(facet, 0));
      }
    });
  }

  filterChange() {
    this.onFilterChanged.emit(this.filterState);
  }

  facetSelected(facetLabel) {
    return (
      this.filterState &&
      this.filterState.facets &&
      this.filterState.facets.indexOf(facetLabel) !== -1
    );
  }

  toggleFacet(facetLabel, event) {
    event.stopPropagation();
    if (this.facetSelected(facetLabel)) {
      const index = this.filterState.facets.indexOf(facetLabel);
      this.filterState.facets.splice(index, 1);
    } else {
      this.filterState.facets.push(facetLabel);
    }
    this.filterState = this.filterState;
    this.filterChange();
  }

  hasFacets() {
    return (
      this.filterState.availableFacets &&
      this.filterState.availableFacets.length > 0
    );
  }

  toggleDropdown(event) {
    event.stopPropagation();
    this.ariaExpanded = !this.ariaExpanded;
    this.ariaHidden = !this.ariaHidden;
  }

  autoCloseDropdown() {
    this.ariaExpanded = false;
    this.ariaHidden = true;
  }
}
