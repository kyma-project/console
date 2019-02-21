import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SearchFormData } from './data/search-form-data';
import { SearchService } from './service/search-service';
import { PlainLogQuery } from './data/plain-log-query';

import {
  debounceTime,
  delay,
  distinctUntilChanged,
  switchMapTo,
  takeUntil,
} from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { observe } from 'rxjs-observe';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit, OnDestroy {
  fromValues = ['5m', '15m', '1h', '12h', '1d', '3d', '7d'];
  toValues = ['now'];
  directions = ['backward', 'forward'];
  emptySearchResult = {
    streams: [
      {
        availableLabels: [],
        labels: '',
        entries: [
          {
            ts: '',
            line: '',
          },
        ],
      },
    ],
  };

  searchResult = this.emptySearchResult;

  @Input() labels = { values: [] };
  labelValues = { values: [] };
  error: string = null;
  model = new SearchFormData('', 1000, '5m', 'now', '', 'backward');

  selectedLabels = new Map();
  public loaded: Observable<boolean> = observableOf(false);

  constructor(private searchService: SearchService) {
    const { observables, proxy } = observe<SearchFormComponent>(this);
    observables.ngOnInit
      .pipe(
        switchMapTo(observables.loaded),
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(observables.ngOnDestroy),
      )
      .subscribe(value => this.loadLabels());
    return proxy;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onSubmit() {
    const from = new Date();
    if (this.model.from.endsWith('m')) {
      from.setMinutes(
        -1 * +this.model.from.substr(0, this.model.from.length - 1),
      );
    }

    if (this.model.from.endsWith('h')) {
      from.setHours(
        -1 * +this.model.from.substr(0, this.model.from.length - 1),
      );
    }

    if (this.model.from.endsWith('d')) {
      from.setDate(-1 * +this.model.from.substr(0, this.model.from.length - 1));
    }

    const searchQuery = new PlainLogQuery();

    const labelExpPos = this.model.query.indexOf('}');

    searchQuery.regexp = this.model.query.substr(labelExpPos + 1);
    searchQuery.from = from.getTime();
    searchQuery.to = new Date().getTime();
    searchQuery.query = this.model.query.substring(0, labelExpPos + 1);
    searchQuery.limit = this.model.limit;
    searchQuery.direction = this.model.direction;

    this.searchService
      .search(searchQuery)
      .pipe(delay(500))
      .subscribe(
        data => {
          const result = JSON.parse(data);
          if ('streams' in result) {
            this.searchResult = result;
            this.searchResult.streams.forEach(stream => {
              stream.availableLabels = stream.labels
                .replace('{', '')
                .replace('}', '')
                .split(',');
            });
          } else {
            this.searchResult = this.emptySearchResult;
          }
        },
        err => {
          console.error(err);
          this.error = err.error;
        },
        () => {},
      );
  }

  loadLabels() {
    this.searchService.getLabels().subscribe(
      data => {
        this.labels = JSON.parse(data);
      },
      err => {
        console.error(err);
        this.error = err.error;
      },
      () => {},
    );
  }

  loadLabelValues(selectedLabel: string) {
    this.model.label = selectedLabel;
    if (!this.model.label) {
      return;
    }
    this.searchService
      .getLabelValues(selectedLabel)
      .pipe()
      .subscribe(
        data => {
          this.labelValues = JSON.parse(data);
        },
        err => {
          console.error(err);
          this.error = err.error;
        },
        () => {},
      );
  }

  selectLabelValue(labelValue: string) {
    this.selectedLabels.set(this.model.label, labelValue);
    this.updateQuery();
  }

  removeLabel(label: string) {
    this.selectedLabels.delete(label.split('=')[0]);
    this.updateQuery();
  }

  addLabel(label: string) {
    this.selectedLabels.set(
      label.split('=')[0].replace(/^["]{1}/gms, ''),
      label
        .split('=')[1]
        .replace(/["]{1}$/gms, '')
        .replace(/^["]{1}/gms, ''),
    );
    this.updateQuery();
  }

  updateQuery() {
    if (this.selectedLabels.size > 0) {
      const regexp = /[,]{1}\s$/gms;
      let query = '{';
      this.selectedLabels.forEach((value, key) => {
        query = query + key + '="' + value + '", ';
      });
      this.model.query = query.replace(regexp, '}');
    } else {
      this.model.query = '';
    }
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }
}
