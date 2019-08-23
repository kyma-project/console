import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from './service/search-service';
import { IPlainLogQuery, ISearchFormData } from './data';

import { Observable, of as observableOf, interval, Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

import { LuigiContextService } from './service/luigi-context.service';
import { ILogStream } from './data/log-stream';
import { ISearchResult } from './data/search-result';
import { IPod, IPodQueryResponse } from './data/pod-query';

import { PodsSubscriptonService } from './service/pods-subscription/pods-subscription.service';

import { REFRESH_INTERVAL } from './shared/constants';

import { AriaDisabledDirective } from './shared/appAriaDisabled.directive';

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
  emptySearchResult: ISearchResult = {
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
    showHealthChecks: false,
    showIstioLogs: false,
  };

  selectedLabels: Map<string, string | string[]> = new Map();
  mandatoryLabels: Map<string, string> = new Map();

  private namespace: string;
  private istioProxyFilter = ', container_name != "istio-proxy"';

  public loaded: Observable<boolean> = observableOf(false);
  private pollingSubscription: Subscription;
  public autoRefreshEnabled = true;
  public canSetAutoRefresh = true;

  get isQueryEmpty(): boolean {
    return !this.getSearchQuery().query;
  }

  public isFunctionLabelPresent = false;

  private podsForFunction: IPod[];
  public isSearchButtonTooltipOpen = false;
  readonly DISABLED_SEARCH_BUTTON_TOOLTIP = `The results are updated automatically`;

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
      this.isFunctionLabelPresent = true;
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

  ngOnInit(): void {
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.autoRefreshEnabled) {
      this.stopPollingSubscription();
    }
  }

  setupAutoRefresh() {
    if (this.model.to === 'now') {
      if (this.autoRefreshEnabled) {
        this.runPollingSubscription();
      }
    } else {
      this.canSetAutoRefresh = false;
    }
  }

  onSubmit() {
    this.refreshResults();
  }

  addQueryFilters(searchQuery: IPlainLogQuery): IPlainLogQuery {
    let { query } = searchQuery;

    if (this.model.showIstioLogs) {
      // remove istio proxy filer from query
      query = query.replace(this.istioProxyFilter, '');
    } else {
      if (query.indexOf(this.istioProxyFilter) === -1) {
        // add istio proxy filer to query
        query = query.replace('}', this.istioProxyFilter + '}');
      }
    }

    return { ...searchQuery, query };
  }

  refreshResults() {
    const searchQuery: IPlainLogQuery = this.addQueryFilters(
      this.getSearchQuery(),
    );

    this.isFunctionLabelPresent =
      searchQuery &&
      searchQuery.query &&
      searchQuery.query.indexOf('function=') > -1;

    this.searchService.search(searchQuery).subscribe(
      data => {
        const result = JSON.parse(data);

        this.searchResult =
          'streams' in result
            ? this.processSearchResult(result)
            : this.emptySearchResult;
      },
      err => {
        console.error(err);
        this.error = err.error;
      },
    );
  }

  private processSearchResult(result: ISearchResult): ISearchResult {
    result.streams.forEach(stream => {
      stream.availableLabels = stream.labels
        .replace('{', '')
        .replace('}', '')
        .split(',');
    });
    if (this.isFunctionLabelPresent && !this.model.showOutdatedLogs) {
      result.streams = result.streams.filter((ls: ILogStream) =>
        this.fiterStreamByInstance(ls, this.getLabelValue),
      );
    }

    if (!this.model.showHealthChecks) {
      result.streams = result.streams.map(this.filterHealthchecks);
    }

    result.streams = result.streams
      .sort(this.sortFromNewestLogs)
      .filter((s: ILogStream) => s.entries && s.entries.length);

    return result;
  }

  private fiterStreamByInstance(
    stream: ILogStream,
    getLabelValueFn: (label: string) => string,
  ): boolean {
    // if a stream has instance="xyz" label, check if "xyz" is in podsForFunction list.
    const instanceLabel = stream.availableLabels.find(
      (label: string) => label.indexOf('instance') > -1,
    );
    if (!instanceLabel || !this.podsForFunction) {
      return false; // this stream doesn't have an 'instance' label or there are no pods to compare
    } else {
      const instanceValue = getLabelValueFn(instanceLabel);

      return this.podsForFunction.some(
        (pod: IPod) => pod.name === instanceValue,
      ); // this stream does have an 'instance' label. Return true if the instance name is in podsForFunction list.
    }
  }

  private filterHealthchecks(stream: ILogStream): ILogStream {
    stream.entries = stream.entries.filter(
      (entry: any) => entry.line.indexOf('GET /healthz') < 0,
    );
    return stream;
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
        (p: IPod) => p.labels && p.labels.function === lambdaName,
      );
      this.onSubmit();
    });
  }

  sortFromNewestLogs(stream1: ILogStream, stream2: ILogStream): number {
    if (!(stream1 && stream1.entries && stream2 && stream2.entries)) {
      return 0;
    }

    const getTimestamp = (stream: ILogStream) => {
      const streamLastEntry =
        stream && stream.entries && stream.entries.length
          ? stream.entries[stream.entries.length - 1]
          : {};
      const streamLastEntryTimestamp = new Date(
        streamLastEntry && streamLastEntry.ts ? streamLastEntry.ts : 0,
      );
      return streamLastEntryTimestamp;
    };

    const stream1Timestamp = getTimestamp(stream1);
    const stream2Timestamp = getTimestamp(stream2);

    return stream2Timestamp.getTime() - stream1Timestamp.getTime();
  }

  onToTimeChanged(event: { target: { value: string } }) {
    if (event.target.value === 'now') {
      this.canSetAutoRefresh = true;
      if (this.autoRefreshEnabled) {
        this.runPollingSubscription();
      }
    } else {
      this.canSetAutoRefresh = false;
      this.stopPollingSubscription();
    }
  }

  toggleAutoRefresh(e?) {
    this.autoRefreshEnabled =
      e === undefined ? !this.autoRefreshEnabled : e.target.checked;
    if (this.autoRefreshEnabled) {
      this.tryRefreshResults(); // refresh so that user immediately can see new logs
      this.runPollingSubscription();
    } else {
      this.stopPollingSubscription();
    }
  }

  private runPollingSubscription() {
    this.pollingSubscription = interval(REFRESH_INTERVAL).subscribe(() =>
      this.tryRefreshResults(),
    );
  }

  private stopPollingSubscription() {
    if (this.pollingSubscription && !this.pollingSubscription.closed) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private tryRefreshResults() {
    if (!this.isQueryEmpty) {
      this.refreshResults();
    }
  }

  public isSearchResultEmpty(searchResult: ISearchResult): boolean {
    return !searchResult.streams.some(
      (s: ILogStream) => !!(s.entries && s.entries.length),
    );
  }
}
