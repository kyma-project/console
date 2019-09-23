import { createContext } from "react";

export const SearchParamsContext = createContext({});

export const ADD_LABEL = 'ADD_LABEL';
export const SET_LABELS = 'SET_LABELS';
export const SET_SHOW_PREVIOUS_LOGS = 'SET_SHOW_PREVIOUS_LOGS';
export const SET_SHOW_HEALTH_CHECKS = 'SET_SHOW_HEALTH_CHECKS';
export const SET_SHOW_ISTIO_LOGS = 'SET_SHOW_ISTIO_LOGS';
export const SET_SEARCH_PHRASE = 'SET_SEARCH_PHRASE';
export const SET_QUERY = 'SET_QUERY';
export const SET_RESULT_LIMIT = 'SET_RESULT_LIMIT';
export const SET_AUTO_REFRESH = 'SET_AUTO_REFRESH';
export const SET_SORT_DIR = 'SET_SORT_DIR';
export const SET_LOGS_PERIOD = 'SET_LOGS_PERIOD';

export default function searchParamsReducer(state, action) {
  const { type, value } = action;

  switch (type) {
    case ADD_LABEL: return { ...state, labels: [...state.labels, value] }
    case SET_LABELS: return { ...state, labels: value };

    case SET_SHOW_PREVIOUS_LOGS: return { ...state, showPreviousLogs: value };
    case SET_SHOW_HEALTH_CHECKS: return { ...state, showHealthChecks: value }
    case SET_SHOW_ISTIO_LOGS: return { ...state, showIstioLogs: value }

    case SET_SEARCH_PHRASE: return { ...state, searchPhrase: value }
    case SET_QUERY: return { ...state, query: value }
    case SET_RESULT_LIMIT: return { ...state, resultLimit: value }

    case SET_AUTO_REFRESH: return { ...state, autoRefreshEnabled: value }

    case SET_SORT_DIR: return { ...state, sortDirection: value }
    case SET_LOGS_PERIOD: return { ...state, logsPeriod: value }
    default: return state
  }
}