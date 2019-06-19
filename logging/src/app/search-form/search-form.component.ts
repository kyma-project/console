import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from './service/search-service';
import { IPlainLogQuery, ISearchFormData } from './data';

import { Observable, of as observableOf } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { LuigiContextService } from './service/luigi-context.service';
import { ILogStream } from './data/log-stream';
import { IPod, IPodQueryResponse } from './data/pod-query';

import { PodsSubscriptonService } from './service/pods-subscription/pods-subscription.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  providers: [PodsSubscriptonService],
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
        entries: [{ ts: '', line: '' }],
      },
    ],
  };
  searchResult = this.emptySearchResult;
  labelValues = { values: [] };
  error: string = null;

  model: ISearchFormData = {
    from: '5m',
    to: 'now',
    query: '',
    extraQuery: '',
    limit: 1000,
    direction: 'backward',
    label: '',
    showOutdatedLogs: false,
  };

  selectedLabels: Map<string, string | string[]> = new Map();
  mandatoryLabels: Map<string, string> = new Map();

  private namespace: string;

  public loaded: Observable<boolean> = observableOf(false);

  public isHistoricalDataSwitchVisible = false;

  private podsForFunction: IPod[];

  constructor(
    private route: ActivatedRoute,
    private luigiContextService: LuigiContextService,
    private searchService: SearchService,
    private podsSubscriptionService: PodsSubscriptonService,
  ) {
    this.luigiContextService.getContext().subscribe(data => {
      this.route.queryParams.subscribe(params => {
        this.processParams(params);
        if (this.mandatoryLabels.size === 0) {
          this.loadLabels();
        }
      });
    });
  }

  processParams(params) {
    if (!params || params.length === 0) {
      return;
    }

    if (params.namespace) {
      this.addLabel('namespace=' + params.namespace, true);
      this.namespace = params.namespace;
    }

    if (params.function) {
      this.addLabel('function=' + params.function, true);
      this.title = `Logs for function "${params.function}"`;
      this.subscribeToCurrentPodName(params.function);
      this.isHistoricalDataSwitchVisible = true;
    }

    if (params.pod) {
      this.addLabel('instance=' + params.pod, true);
      this.title = `Logs for pod "${params.pod}"`;
    }

    if (params.container_name) {
      this.addLabel('container_name=' + params.container_name, true);
    }

    if (this.selectedLabels.size > 0) {
      this.onSubmit();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onSubmit() {
    const searchQuery: IPlainLogQuery = this.getSearchQuery();

    this.searchService.search(searchQuery).subscribe(
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
          if (
            this.isHistoricalDataSwitchVisible &&
            !this.model.showOutdatedLogs
          ) {
            this.searchResult.streams = this.searchResult.streams.filter(
              (ls: ILogStream) =>
                this.fiterStreamByInstance(ls, this.getLabelValue),
            );
          }
        } else {
          this.searchResult = this.emptySearchResult;
        }
      },
      err => {
        console.error(err);
        this.error = err.error;
      },
    );
  }

  private fiterStreamByInstance(
    stream: ILogStream,
    getLabelValueFn: (label: string) => string,
  ): boolean {
    // if a stream has instance="xyz" label, check if "xyz" is in podsForFunction list.
    const instanceLabel = stream.availableLabels.find((label: string) =>
      label.includes('instance'),
    );
    if (!instanceLabel || !this.podsForFunction) {
      return true; // this stream doesn't have an 'instance' label
    } else {
      const instanceValue = getLabelValueFn(instanceLabel);

      return this.podsForFunction.some(
        (pod: IPod) => pod.name === instanceValue,
      ); // this stream does have an 'instance' label. Return true if the instance name is in podsForFunction list.
    }
  }

  private getSearchQuery() {
    const from: Date = new Date();
    const value: number =
      -1 * +this.model.from.substr(0, this.model.from.length - 1);

    if (this.model.from.endsWith('m')) {
      from.setMinutes(value);
    }

    if (this.model.from.endsWith('h')) {
      from.setHours(value);
    }

    if (this.model.from.endsWith('d')) {
      from.setDate(value);
    }

    const labelExpPos: number = this.model.query.indexOf('}');

    return {
      regexp: this.model.query.substr(labelExpPos + 1) + this.model.extraQuery,
      from: from.getTime(),
      to: new Date().getTime(),
      query: this.model.query.substring(0, labelExpPos + 1),
      limit: this.model.limit,
      direction: this.model.direction,
    };
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
    );
  }

  loadLabelValues(selectedLabel: string) {
    this.model.label = selectedLabel;
    if (!this.model.label) {
      return;
    }
    this.searchService.getLabelValues(selectedLabel).subscribe(
      data => {
        this.labelValues = JSON.parse(data);
      },
      err => {
        console.error(err);
        this.error = err.error;
      },
    );
  }

  selectLabelValue(labelValue: string) {
    this.selectedLabels.set(this.model.label, labelValue);
    this.updateQuery();
  }

  removeLabel(label: string, force = false) {
    const l = label.split('=')[0];
    if (!this.isMandatoryLabel(l) || force) {
      this.selectedLabels.delete(l);
      this.updateQuery();
    }
  }

  isMandatoryLabel(label: string) {
    return this.mandatoryLabels.get(label) !== undefined;
  }

  isSelectedLabel(label: string): boolean {
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
    return label
      .split('=')[0]
      .trim()
      .replace(/^["]{1}/gm, '');
  }

  getLabelValue(label: string) {
    return label
      .split('=')[1]
      .trim()
      .replace(/["]{1}$/gm, '')
      .replace(/^["]{1}/gm, '');
  }

  updateQuery() {
    if (this.selectedLabels.size > 0) {
      const selectedLabelsFormatted = Array.from(this.selectedLabels).map(
        ([key, value]) => `${key}="${value}"`,
      );

      this.model.query = '{' + selectedLabelsFormatted.join(', ') + '}';
    } else {
      this.model.query = '';
    }
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }

  handleOutdatedLogsStateChange(event: {
    currentTarget: { checked: boolean };
  }) {
    if (event.currentTarget.checked) {
      this.updateQuery();
    } else {
      this.updateQuery();
    }

    this.onSubmit();
  }

  private subscribeToCurrentPodName(lambdaName: string) {
    if (!lambdaName || !this.namespace) {
      return;
    }

    const allPodsQuery = this.podsSubscriptionService.getAllPods(
      this.namespace,
    );

    if (!allPodsQuery) {
      return;
    }

    allPodsQuery.valueChanges.subscribe((response: IPodQueryResponse) => {
      this.podsForFunction = response.data.pods.filter(
        (p: IPod) => p.labels.function === lambdaName,
      );
      this.onSubmit();
    });
  }
}
