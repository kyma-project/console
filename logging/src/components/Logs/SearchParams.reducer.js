import { createContext, useContext } from "react";
import {
  SORT_DESCENDING,
  DEFAULT_PERIOD
} from '../../constants'

export const SearchParamsContext = createContext({});

export const useSearchParams=()=>useContext(SearchParamsContext);

export const ADD_LABEL = 'ADD_LABEL';
export const SET_LABELS = 'SET_LABELS';
export const SET_SHOW_PREVIOUS_LOGS = 'SET_SHOW_PREVIOUS_LOGS';
export const SET_SHOW_HEALTH_CHECKS = 'SET_SHOW_HEALTH_CHECKS';
export const SET_SHOW_ISTIO_LOGS = 'SET_SHOW_ISTIO_LOGS';
export const SET_SEARCH_PHRASE = 'SET_SEARCH_PHRASE';
export const SET_RESULT_LIMIT = 'SET_RESULT_LIMIT';
export const SET_AUTO_REFRESH = 'SET_AUTO_REFRESH';
export const SET_SORT_DIR = 'SET_SORT_DIR';
export const SET_LOGS_PERIOD = 'SET_LOGS_PERIOD';

export const defaultSearchParams = {
  searchPhrase: '',
  labels: [],
  readonlyLabels: [],
  logsPeriod: DEFAULT_PERIOD,
  resultLimit: 1000,
  showPreviousLogs: false,
  showHealthChecks: false,
  showIstioLogs: false,
  sortDirection: SORT_DESCENDING,
  autoRefreshEnabled: true,
};

export const actions = (dispatch) => ({
  addLabel: label => dispatch({ type: ADD_LABEL, value: label }),
  setLabels: labels => dispatch({ type: SET_LABELS, value: labels }),
  setShowPreviousLogs: show => dispatch({ type: SET_SHOW_PREVIOUS_LOGS, value: show }),
  setShowHealthChecks: show => dispatch({ type: SET_SHOW_HEALTH_CHECKS, value: show }),
  setShowIstioLogs: show => dispatch({ type: SET_SHOW_ISTIO_LOGS, value: show }),
  setSearchPhrase: phrase => dispatch({ type: SET_SEARCH_PHRASE, value: phrase }),
  setResultLimit: limit => dispatch({ type: SET_RESULT_LIMIT, value: limit }),
  setAutoRefresh: isRefreshEnabled => dispatch({ type: SET_AUTO_REFRESH, value: isRefreshEnabled }),
  setLogsPeriod: period => dispatch({ type: SET_LOGS_PERIOD, value: period }),
  setSortDir: dir => dispatch({ type: SET_SORT_DIR, value: dir })
});


export default function searchParamsReducer(state, action) {
  const { type, value } = action;

  switch (type) {
    case ADD_LABEL: return { ...state, labels: [...state.labels, value] }
    case SET_LABELS: return { ...state, labels: value };

    case SET_SHOW_PREVIOUS_LOGS: return { ...state, showPreviousLogs: value };
    case SET_SHOW_HEALTH_CHECKS: return { ...state, showHealthChecks: value }
    case SET_SHOW_ISTIO_LOGS: return { ...state, showIstioLogs: value }

    case SET_SEARCH_PHRASE: return { ...state, searchPhrase: value }
    case SET_RESULT_LIMIT: return { ...state, resultLimit: value }

    case SET_AUTO_REFRESH: return { ...state, autoRefreshEnabled: value }

    case SET_SORT_DIR: return { ...state, sortDirection: value }
    case SET_LOGS_PERIOD: return { ...state, logsPeriod: value }
    default: return state
  }
}
