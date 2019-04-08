import { Filters, ConfigurationLabels, Configuration } from '../types';

export interface IFiltersService {
  activeFilters: Filters;
  setFilterLabel: (label: string) => void;
  removeFilterLabel: (label: string) => void;
  removeAllFilters: () => void;
  hasActiveLabel: (key: string, value: string) => boolean;
}

export interface ILabelsService {
  getUniqLabels: ConfigurationLabels;
}

export interface IConfigurationsService {
  originalConfigs: Configuration[];
  filteredConfigs: Configuration[];
}

export enum SubscriptionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
