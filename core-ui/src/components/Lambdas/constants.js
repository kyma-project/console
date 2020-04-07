export const TOOLBAR = {
  TITLE: 'Lambdas',
  DESCRIPTION:
    'Extend your applications with lambdas that you can trigger with incoming events and expose outside the cluster with API Rules.',
};

export const TRIGGER_SUBSCRIBER = {
  SERVING_SERVICE: 'Service',
  SERVING_API_VERSION: 'serving.knative.dev/v1',
  BROKER: 'default',
};

export const GQL_QUERIES = {
  EVENT_ACTIVATIONS: {
    ERROR_MESSAGE: `Error while fetching available Events in "{namespace}" namespace: {error}`,
  },
  EVENT_TRIGGERS: {
    ERROR_MESSAGE: `Error while fetching Event Triggers for "{lambdaName}" Lambda: {error}`,
  },
};

export const GQL_MUTATIONS = {
  CREATE_MANY_TRIGGERS: {
    SUCCESS_MESSAGE: `Event Triggers are successfully created`,
    ERROR_MESSAGE: `Error while creating Event Triggers for "{lambdaName}" Lambda: {error}`,
  },
  DELETE_TRIGGER: {
    SUCCESS_MESSAGE: `Event Trigger is successfully removed`,
    ERROR_MESSAGE: `Error while deleting "{triggerName}" Event Trigger for "{lambdaName}" Lambda: {error}`,
    CONFIRM_MODAL: {
      TITLE: `Remove Event Trigger`,
      MESSAGE: `Are you sure you want to delete "{triggerName}" Event Trigger for "{lambdaName}" Lambda?`,
    },
  },
};

export const TRIGGER_SCHEMA = {
  CSS_PREFIX: 'schema-event-trigger',
  PAYLOAD_TEXT: 'Payload',
  EXAMPLE_TEXT: 'Example',
  COLUMN_NAMES: ['Name', 'Title', 'Type', 'Format', 'Default', 'Description'],
};

export const MODALS = {
  CREATE_BINDING: {
    CREATE_BUTTON_POPUP_MESSAGE: 'At least one event must be marked.',
  },
};

export const EVENT_TRIGGERS_PANEL = {
  LIST: {
    TITLE: 'Event Triggers',
  },
  ADD_MODAL: {
    OPEN_BUTTON: {
      TEXT: 'Add Event Trigger',
      NOT_ENTRIES_POPUP_MESSAGE:
        'No Events available to connect in current namespace.',
    },
    TITLE: 'Add Event Trigger',
    CONFIRM_BUTTON: {
      TEXT: 'Add',
      INVALID_POPUP_MESSAGE: 'At least one Event must be checked.',
    },
  },
};

export const BUTTONS = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
};

export const ERRORS = {
  SERVER: 'Server error. Please contact the admin of the cluster.',
  RESOURCES_NOT_FOUND: 'Resources not found.',
  NOT_MATCHING_SEARCH_QUERY: "Couldn't find resources matching this query.",
  NOT_MATCHING_FILTERS: "Couldn't find resources matching this filters.",
};
