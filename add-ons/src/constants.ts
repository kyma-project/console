const extractIsDevelopmentModeFlag = (value: string | boolean): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value.toLowerCase() === 'true') {
    return true;
  }
  return false;
};

export const DEFAULT_CONFIGURATION =
  (window as any)['clusterConfig'].DEFAULT_CONFIGURATION_NAME ||
  'helm-repos-urls';
export const DEFAULT_CONFIGURATION_DESCRIPTION = '';
export const HELM_BROKER_IS_DEVELOPMENT_MODE =
  extractIsDevelopmentModeFlag(
    (window as any)['clusterConfig'].HELM_BROKER_IS_DEVELOPMENT_MODE,
  ) || true;

export const CONFIGURATION_NAME_PREFIX = 'addons-configuration';
export const KYMA_SYSTEM_ENV = 'kyma-system';

export const NOTIFICATION_SHOW_TIME = 5000;

export const BACKEND_MODULE_SERVICE_CATALOG = 'servicecatalogaddons';
export const BACKEND_MODULE_SERVICE_CATALOG_DISPLAY_NAME =
  'Service Catalog Addons';

export const CONFIGURATION_VARIABLE = '{CONFIGURATION}';

export const CONTENT_HEADERS: string[] = ['Name / URL', 'Labels', ''];

export const NOTIFICATION = {
  ADD_CONFIGURATION: {
    TITLE: 'Configuration added',
    CONTENT: `Configuration ${CONFIGURATION_VARIABLE} has been successfully added`,
  },
  UPDATE_CONFIGURATION: {
    TITLE: 'Configuration updated',
    CONTENT: `Configuration ${CONFIGURATION_VARIABLE} has been successfully updated`,
  },
  DELETE_CONFIGURATION: {
    TITLE: 'Configuration removed',
    CONTENT: `Configuration ${CONFIGURATION_VARIABLE} has been successfully removed`,
  },
};

export const HELP = {
  URL_FIELD: '',
  NAME_FIELD: '',
  LABELS_FIELD: '',
};

export const PLACEHOLDERS = {
  URL_FIELD: 'Insert repository URL.',
  NAME_FIELD: 'Insert name.',
  LABELS_FIELD: 'Insert labels (optionally).',
  SEARCH_FIELD: 'Search configurations',
};

export const ERRORS = {
  SERVER: 'Error with server. Please contact with admin of the cluster.',
  RESOURCES_NOT_FOUND: 'Resources not found.',
  NOT_MATCHING_FILTERS: "Couldn't find resources with matching filters.",
  NAME: {
    ALREADY_EXISTS: 'Name already exists',
    REGEX:
      "A name value must consists of alphanumeric characters, '-', '_' or '.', and must starts and ends with an alphanumeric character and contains maximum 63 chars.",
    SHORT: 'Name must contains more than 3 chars.',
    LONG_NAME: 'Name must contains less than 64 chars.',
  },
  URL: {
    ALREADY_EXISTS: 'Url already exists in config.',
    STARTS_WITH_HTTP: 'Url must starts with http(s) protocol.',
    YAML_EXTENSION: 'Url must have .yaml or .yml extension.',
    RESOURCE_NOT_EXISTS: 'Url not exists.',
  },
};

export const TOOLTIP_DATA_ERROR = {
  type: 'error',
  content: 'Fill out all mandatory fields',
};
