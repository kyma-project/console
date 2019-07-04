import React from 'react';

export type BackendModule = string;

export interface Configuration {
  name: string;
  labels?: ConfigurationLabels;
  urls: ConfigurationURL[];
}

export interface ConfigurationLabels {
  [key: string]: string;
}
export type ConfigurationURL = string;

export interface FilterLabels {
  [key: string]: string[];
}

export interface Filters {
  search: string;
  labels: FilterLabels;
}

export interface ActiveFiltersAction {
  payload: {
    key: string;
    value: string;
  };
  type: ActiveFiltersActionType;
}

export enum ActiveFiltersActionType {
  SET_SEARCH = 'SET_SEARCH',
  SET_LABEL = 'SET_LABEL',
  REMOVE_LABEL = 'REMOVE_LABEL',
  REMOVE_ALL_FILTERS = 'REMOVE_ALL_FILTERS',
}

export interface RemoveFiltersInterface {
  removeFilterLabel: (key: string, value: string) => void;
  removeAllFiltersLabels: () => void;
}

export interface FiltersLabelsInterface {
  uniqueLabels: FilterLabels;
  setFilterLabel: (key: string, value: string) => void;
  hasActiveLabel: (key: string, value: string) => boolean;
}

export interface ConfigurationsService
  extends FiltersLabelsInterface,
    RemoveFiltersInterface {}

export interface Notification {
  title: string;
  content: string | React.ReactNode;
  color?: string;
  icon?: string;
}
