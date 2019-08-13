import { TooltipType } from '@kyma-project/components';

export const DEFAULT_CONFIGURATION =
  (window as any).clusterConfig.DEFAULT_CONFIGURATION_NAME || 'helm-repos-urls';
export const DEFAULT_CONFIGURATION_DESCRIPTION =
  'This is the default addons configuration. Do not edit or delete it.';
export const HELM_BROKER_REPO_URL_PREFIXES = (window as any).clusterConfig
  .HELM_BROKER_REPO_URL_PREFIXES;

export const KYMA_SYSTEM_ENV = 'kyma-system';
export const NOTIFICATION_SHOW_TIME = 5000;

export const BACKEND_MODULE_SERVICE_CATALOG = 'servicecatalogaddons';
export const BACKEND_MODULE_SERVICE_CATALOG_DISPLAY_NAME =
  'Service Catalog Addons';

export const CONFIGURATION_VARIABLE = '{CONFIGURATION}';
export const KEY_VARIABLE = '{KEY}';
export const VALUE_VARIABLE = '{VALUE}';
export const LABEL_VARIABLE = '{LABEL}';

export const CONTENT_HEADERS: string[] = ['Name / URL', 'Labels', ''];
export const NO_LABELS_AVAILABLE: string = 'No labels available';

export const NOTIFICATION = {
  ADD_CONFIGURATION: {
    TITLE: 'Configuration added',
    CONTENT: `The ${CONFIGURATION_VARIABLE} configuration has been successfully added.`,
  },
  UPDATE_CONFIGURATION: {
    TITLE: 'Configuration updated',
    CONTENT: `The ${CONFIGURATION_VARIABLE} configuration has been successfully updated.`,
  },
  DELETE_CONFIGURATION: {
    TITLE: 'Configuration removed',
    CONTENT: `The ${CONFIGURATION_VARIABLE} configuration has been successfully removed.`,
  },
};

export const FORMS = {
  NAME_LABEL: 'Name',
  LABELS_LABEL: 'Labels',
  URL_LABEL: 'Urls',
  SELECT_CONFIGURATION_LABEL: 'Configuration',
  ADD_URL_BUTTON: 'Add URL',
  ADD_LABEL_BUTTON: 'Add Label',
  DELETE_CONFIGURATION_CONFIRM_TEXT: `Are you sure you want to delete the "${CONFIGURATION_VARIABLE}" configuration?`,
  DELETE_URL_CONFIRM_TEXT: `Are you sure you want to delete URL of the "${CONFIGURATION_VARIABLE}" configuration?`,
};

export const CORE = {
  PANEL_TITLE: 'Repository URLs',
  CLUSTER_ADD_ONS_CONFIGURATION_TITLE: 'Cluster Addons Configuration',
  ADD_ONS_CONFIGURATION_TITLE: 'Addons Configuration',
  CLUSTER_ADD_ONS_CONFIGURATION_DESCRIPTION:
    'Create and manage cluster-wide addons configurations, which allows you to extend the Service Catalog with additional cluster-wide services.',
  ADD_ONS_CONFIGURATION_DESCRIPTION:
    'Create and manage Namespace-scoped addons configurations, which allows you to extend the Service Catalog with additional Namespace-scoped services.',
};

export const FILTERS = {
  LABELS_LEGEND: 'Labels',
  CLEAR_ALL_FILTERS: 'Clear All',
};

export const MODAL = {
  CONFIRM_TEXT: 'Add',
  CANCEL_TEXT: 'Cancel',
  DELETE_TEXT: 'Delete',
  ADD_URL_BUTTON_TITLE: 'Add URL',
  ADD_URL_MODAL_TITLE: 'Add URL',
  ADD_NEW_CONFIGURATION_BUTTON_TITLE: 'Add New Configuration',
  ADD_NEW_CONFIGURATION_MODAL_TITLE: 'New Configuration',
  DELETE_MODAL_TITLE: 'Delete',
};

const HELP_URL_FIELDS_LIST = `'${HELM_BROKER_REPO_URL_PREFIXES.join(`', '`)}'`;
export const HELP = {
  URL_FIELD: `The URL must be unique for a given configuration and start with one of the following prefixes: ${HELP_URL_FIELDS_LIST}`,
  NAME_FIELD:
    'The name must be unique, start and end with a lowercase letter, and contain only lowercase letters, numbers, dashes, periods, and underscores.',
  LABELS_FIELD:
    'The label must be a unique key=value pair for a given configuration, start and end with an alphanumeric character, and contain only alphanumeric characters, dashes, periods, and underscores.',
};

export const PLACEHOLDERS = {
  URL_FIELD: 'Insert repository URL',
  NAME_FIELD: 'Insert name',
  LABELS_FIELD: 'Insert labels (optional)',
  SEARCH_FIELD: 'Search configurations',
};

export const ERRORS = {
  SERVER: 'Server error. Please contact the admin of the cluster.',
  RESOURCES_NOT_FOUND: 'Resources not found.',
  NOT_MATCHING_FILTERS: "Couldn't find resources with matching filters.",
  NAME: {
    ALREADY_EXISTS: 'This name already exists.',
    REGEX:
      'The name must consist of 4-63 characters, start and end with an alphanumeric character, and contain only alphanumeric characters, dashes, periods, and underscores.',
    SHORT: 'Name must contain more than 3 characters.',
    LONG_NAME: 'Name must contain less than 64 characters.',
  },
  URL: {
    ALREADY_EXISTS: 'This URL already exists in the configuration.',
    WRONG_PREFIX: `URL must start with one of the following prefixes: ${HELP_URL_FIELDS_LIST}`,
    YAML_EXTENSION: 'URL must have .yaml or .yml extension.',
    RESOURCE_NOT_EXISTS: "URL doesn't exist.",
  },
  LABEL: {
    INVALID_LABEL: `Invalid ${LABEL_VARIABLE} label. Key and value should be separated by the equality sign.`,
    KEY_OR_VALUE_INVALID: `Invalid ${KEY_VARIABLE}=${VALUE_VARIABLE} label. In a valid label, key and value cannot be empty, must start and end with an alphanumeric character, and contain only alphanumeric characters, dashes, periods, and underscores.`,
    DUPLICATE_KEYS_EXISTS: `Invalid ${KEY_VARIABLE}=${VALUE_VARIABLE} label. Keys cannot be reused.`,
  },
};

export const TOOLTIP_DATA_ERROR = {
  type: TooltipType.NEGATIVE,
  content: 'Fill out all mandatory fields.',
};
