import {createContext, useContext} from "react";

const LogsContext = createContext({});
export const useLogs = useContext(LogsContext);

export const SET_LABELS = 'SET_LABELS';
export const SET_SHOW_PREVIOUS_LOGS = 'SET_SHOW_PREVIOUS_LOGS';

function reducer(state, action) {
  switch (action.type) {
    case SET_LABELS: return {...state, labels: action.value};
    case SET_SHOW_PREVIOUS_LOGS: return {...state, showPreviousLogs: action.value};
    default: return state
  }
}