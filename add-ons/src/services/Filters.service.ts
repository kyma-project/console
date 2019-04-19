import { useState, useEffect, useReducer } from 'react';
import createContainer from 'constate';

import {
  Filters,
  ActiveFiltersAction,
  ActiveFiltersActionType,
} from '../types';

const useFilters = () => {
  const initialActiveFilters: Filters = {
    search: '',
    labels: {},
  };

  function activeFiltersReducer(state: Filters, action: ActiveFiltersAction) {
    switch (action.type) {
      case ActiveFiltersActionType.SET_SEARCH:
        return { ...state, search: action.payload };
      case ActiveFiltersActionType.SET_LABEL:
        return {
          ...state,
          labels: {
            ...state.labels,
            [action.payload.key]: [
              ...state.labels[action.payload.key],
              action.payload.value,
            ],
          },
        };
      case ActiveFiltersActionType.REMOVE_LABEL:
        return {
          ...state,
          labels: {
            ...state.labels,
            [action.payload.key]: state.labels[action.payload.key].filter(
              label => label !== action.payload.value,
            ),
          },
        };
      case ActiveFiltersActionType.REMOVE_ALL_FILTERS:
        return { ...initialActiveFilters, search: state.search };
      default:
        return state;
    }
  }

  const [activeFilters, dispatchActiveFilters] = useReducer(
    activeFiltersReducer,
      // @ts-ignore
    initialActiveFilters,
  );

  const setSearchFilter = (search: string) => {
    dispatchActiveFilters({
      type: ActiveFiltersActionType.SET_SEARCH,
      payload: search,
    });
  };

  const setFilterLabel = (key: string, value: string) => {
    if (!activeFilters.labels[key]) {
      activeFilters.labels[key] = [];
    }

    if (activeFilters.labels[key].includes(value)) {
      removeFilterLabel(key, value);
    } else {
      dispatchActiveFilters({
        type: ActiveFiltersActionType.SET_LABEL,
        payload: { key, value },
      });
    }
  };

  const removeFilterLabel = (key: string, value: string) => {
    dispatchActiveFilters({
      type: ActiveFiltersActionType.REMOVE_LABEL,
      payload: { key, value },
    });
  };

  const removeAllFiltersLabels = () => {
    dispatchActiveFilters({
      type: ActiveFiltersActionType.REMOVE_ALL_FILTERS,
      payload: { key: '', value: '' },
    });
  };

  const hasActiveLabel = (key: string, value: string): boolean => {
    return (
      activeFilters.labels[key] && activeFilters.labels[key].includes(value)
    );
  };

  return {
    activeFilters,
    setSearchFilter,
    setFilterLabel,
    removeFilterLabel,
    removeAllFiltersLabels,
    hasActiveLabel,
  };
};

export default createContainer(useFilters);
