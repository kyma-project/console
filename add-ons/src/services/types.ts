import { Filters, ConfigurationLabels, Configuration } from '../types';

export interface FiltersService {
  activeFilters: Filters;
  setFilterLabel: (label: string) => void;
  removeFilterLabel: (label: string) => void;
  removeAllFilters: () => void;
  hasActiveLabel: (key: string, value: string) => boolean;
}

export interface LabelsService {
  getUniqLabels: ConfigurationLabels;
}

export interface ConfigurationsService {
  originalConfigs: Configuration[];
  filteredConfigs: Configuration[];
}

export enum SubscriptionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
