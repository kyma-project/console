export const LOCAL_STORAGE_NAMESPACE_FILTERS = 'workspace/namespaceFilters';
export const REFETCH_TIMEOUT = 600;

export const PREFERENCES_TITLE = 'Preferences';

export const API_RULES_TITLE = 'API Rules';
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
    TITLE: 'Add Event Subscription',
    OPEN_BUTTON: {
      TEXT: 'Add Event Trigger',
      NOT_ENTRIES_POPUP_MESSAGE:
        'No Events available to connect in this Namespace.',
      NO_EXPOSED_PORTS_MESSAGE: 'This service has no exposed ports.',
    },
    CONFIRM_BUTTON: {
      TEXT: 'Add',
      INVALID_POPUP_MESSAGE: 'The eventType field must have a proper value.',
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

export const EVENT_SUBSCRIPTION_PANEL = {
  ADD_MODAL: {
    TITLE: 'Create Event Subscription',
    OPEN_BUTTON: {
      TEXT: 'Create Event Subscription',
    },
    CONFIRM_BUTTON: {
      TEXT: 'Save',
    },
    CANCEL_BUTTON: {
      TEXT: 'Close',
    },
    NOTIFICATION: {
      SUCCESS: 'Event subscription created',
      ERROR: 'Cannot create event subscription',
    },
  },
};
