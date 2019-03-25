import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { SearchService } from './service/search-service';
import { IPlainLogQuery, ISearchFormData } from './data';

import {
  debounceTime,
  delay,
  distinctUntilChanged,
  switchMapTo,
  takeUntil,
} from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { observe } from 'rxjs-observe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit, OnDestroy {
  @Input() labels = { values: [] };
  title = 'Logs';
  fromValues = ['5m', '15m', '1h', '12h', '1d', '3d', '7d'];
  toValues = ['now'];
  directions = ['backward', 'forward'];
  emptySearchResult = {
    streams: [
      {
        availableLabels: [],
        labels: '',
        entries: [
          { ts: '', line: ''}
        ]
      }
    ]
  };
  searchResult = this.emptySearchResult;
  labelValues = { values: [] };
  error: string = null;

  model: ISearchFormData = {
    from: '5m',
    to: 'now',
    query: '',
    limit: 1000,
    direction: 'backward',
    label: ''
  };

  selectedLabels = new Map();
  mandatoryLabels = new Map();
  public loaded: Observable<boolean> = observableOf(false);

  constructor(private route: ActivatedRoute, private searchService: SearchService) {
    this.route.queryParams.subscribe(params => {
      this.processParams(params);
    });
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

  processParams(params) {
    if (!params || params.length === 0) {
      return;
    }

    if (params.function) {
      this.addLabel('function=' + params.function, true);
      this.title = `Logs for function "${params.function}"`;
    }
    if (params.pod) {
      this.addLabel('instance=' + params.pod, true);
      this.title = `Logs for pod "${params.pod}"`;
    }
    if (params.namespace) {
      this.addLabel('namespace=' + params.namespace, true);
    }

    if (this.selectedLabels.size > 0) {
      this.onSubmit();
    }
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

    const labelExpPos = this.model.query.indexOf('}');

    const searchQuery: IPlainLogQuery = {
      regexp: this.model.query.substr(labelExpPos + 1),
      from: from.getTime(),
      to: new Date().getTime(),
      query: this.model.query.substring(0, labelExpPos + 1),
      limit: this.model.limit,
      direction: this.model.direction
    };

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
      }
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
        }
      );
  }

  selectLabelValue(labelValue: string) {
    this.selectedLabels.set(this.model.label, labelValue);
    this.updateQuery();
  }

  removeLabel(label: string) {
    const l = label.split('=')[0];
    if (!this.isMandatoryLabel(l)) {
      this.selectedLabels.delete(l);
      this.updateQuery();
    }
  }

  isMandatoryLabel(label: string) {
    return this.mandatoryLabels.get(label) !== undefined;
  }

  isSelectedLabel(label: string) {
    const selectedValue = this.selectedLabels.get(this.getLabelKey(label));
    return selectedValue && selectedValue === this.getLabelValue(label);
  }

  addLabel(label: string, mandatory = false) {
    const key = this.getLabelKey(label);
    const value = this.getLabelValue(label);
    this.selectedLabels.set(key, value);
    if (mandatory) {
      this.mandatoryLabels.set(key, value);
    }
    this.updateQuery();
  }

  getLabelKey(label: string) {
    return label.split('=')[0].trim().replace(/^["]{1}/gms, '');
  }

  getLabelValue(label: string) {
    return label
      .split('=')[1].trim()
      .replace(/["]{1}$/gms, '')
      .replace(/^["]{1}/gms, '');
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
