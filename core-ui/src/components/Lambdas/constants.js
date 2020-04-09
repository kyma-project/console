export const BUTTONS = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
};

export const ERRORS = {
  SERVER: 'Server error. Contact your cluster admin.',
  RESOURCES_NOT_FOUND: "This lambda doesn't have any related resources yet.",
  NOT_MATCHING_SEARCH_QUERY: "Couldn't find resources matching this query.",
  NOT_MATCHING_FILTERS: "Couldn't find resources matching these filters.",
};

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
  SERVICE_INSTANCES: {
    ERROR_MESSAGE: `Error while fetching Service Instances: {error}`,
  },
};

export const GQL_MUTATIONS = {
  CREATE_TRIGGERS: {
    SUCCESS_MESSAGE_SINGLE: `Event Trigger created successfully`,
    SUCCESS_MESSAGE_MANY: `Event Triggers created successfully`,
    ERROR_MESSAGE_SINGLE: `Error while creating an Event Trigger for "{lambdaName}" Lambda: {error}`,
    ERROR_MESSAGE_MANY: `Error while creating Event Triggers for "{lambdaName}" Lambda: {error}`,
  },
  DELETE_TRIGGER: {
    SUCCESS_MESSAGE: `Event Trigger was successfully removed`,
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

export const EVENT_TRIGGERS_PANEL = {
  LIST: {
    TITLE: 'Event Triggers',
    ERRORS: {
      RESOURCES_NOT_FOUND:
        "This lambda doesn't have any Event Triggers yet.",
      NOT_MATCHING_SEARCH_QUERY:
        "Couldn't find Event Triggers matching this query.",
    },
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

export const SERVICE_BINDINGS_PANEL = {
  LIST: {
    TITLE: 'Service Bindings',
    ERRORS: {
      RESOURCES_NOT_FOUND:
        "This lambda doesn't have any Service Bindings yet.",
      NOT_MATCHING_SEARCH_QUERY:
        "Couldn't find Service Bindings matching this query.",
    },
  },
  CREATE_MODAL: {
    OPEN_BUTTON: {
      TEXT: 'Create Service Binding',
      NOT_ENTRIES_POPUP_MESSAGE:
        'There are no Service Instances available to bind in this Namespace. Create a Service Instance first.',
    },
    TITLE: 'Create Service Binding',
    CONFIRM_BUTTON: {
      TEXT: 'Create',
      POPUP_MESSAGES: {
        NO_SERVICE_INSTANCE_SELECTED: 'You must select a Service Instance.',
        NO_SECRET_SELECTED: 'You must create or select a Secret.',
      },
    },
  },
  FORM: {
    NO_SECRETS_FOUND:
      'There are no Secrets available. Create a new Secret to bind the Service Instance.',
  },
};
