import {
  LOCAL_STORAGE_SHOW_SYSTEM_NAMESPACES,
  LOCAL_STORAGE_NAMESPACE_FILTERS,
} from './../../shared/constants';

export function readStoredFilters() {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_NAMESPACE_FILTERS);
    return JSON.parse(item) || [];
  } catch (error) {
    return [];
  }
}

export function saveStoredFilters(filters) {
  window.localStorage.setItem(
    LOCAL_STORAGE_NAMESPACE_FILTERS,
    JSON.stringify(filters),
  );
}

export function shouldShowSystemNamespaces() {
  return true;
}
