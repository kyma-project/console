export const SORT_DESCENDING = 'descending';
export const SORT_ASCENDING = 'ascending';

export const SORT_TYPES = [SORT_DESCENDING, SORT_ASCENDING];
export const SORT_DROPDOWN_VALUES = [
  { value: SORT_DESCENDING, label: 'newest first' },
  { value: SORT_ASCENDING, label: 'oldest first' },
];

export const PERIODS = [
  'last minute',
  'last 5 minutes',
  'last 15 minutes',
  'last hour',
];

export const DEFAULT_PERIOD = PERIODS[2];

export const LOG_LABEL_CATEGORIES = ['namespace', 'function', 'container_name'];

export const LOG_REFRESH_INTERVAL = 2000; // ms
