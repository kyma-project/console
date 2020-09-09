export const LOCAL_STORAGE_NAMESPACE_FILTERS = 'workspace/namespaceFilters';
export const REFETCH_TIMEOUT = 600;

export const API_RULES_TITLE = 'API Rules';
export const OAUTH_CLIENTS_TITLE = 'OAuth Clients';
export const NAMESPACE_DETAILS_TITLE = 'Namespace Details';
export const NAMESPACES_TITLE = 'Namespaces';
export const SERVICES_TITLE = 'Services';
export const SECRETS_TITLE = 'Secrets';

export const ERRORS = {
  SERVER: 'Server error. Contact your cluster admin.',
  RESOURCES_NOT_FOUND: 'There are no related resources yet.',
  NOT_MATCHING_SEARCH_QUERY: "Couldn't find resources matching this query.",
  NOT_MATCHING_FILTERS: "Couldn't find resources matching these filters.",
};

export const EVENT_TRIGGERS_PANEL = {
  LIST: {
    TITLE: 'Event Triggers',
    ERRORS: {
      RESOURCES_NOT_FOUND: 'There are no Event Triggers yet.',
      NOT_MATCHING_SEARCH_QUERY:
        "Couldn't find Event Triggers matching this query.",
    },
  },
  ADD_MODAL: {
    TITLE: 'Add Event Trigger',
    OPEN_BUTTON: {
      TEXT: 'Add Event Trigger',
      NOT_ENTRIES_POPUP_MESSAGE:
        'No Events available to connect in this Namespace.',
    },
    CONFIRM_BUTTON: {
      TEXT: 'Add',
      INVALID_POPUP_MESSAGE: 'At least one Event must be checked.',
    },
  },
};

export const TRIGGER_SCHEMA = {
  CSS_PREFIX: 'schema-event-trigger',
  PAYLOAD_TEXT: 'Payload',
  EXAMPLE_TEXT: 'Example',
  COLUMN_NAMES: ['Name', 'Title', 'Type', 'Format', 'Default', 'Description'],
};

export const OAUTH_DOC_URL = '/docs/components/security';
