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

export const LAMBDAS_LIST = {
  ERRORS: {
    RESOURCES_NOT_FOUND: "This namespace doesn't have any Lambdas yet.",
    NOT_MATCHING_SEARCH_QUERY: "Couldn't find Lambdas matching this query.",
  },
};

export const TRIGGER_SUBSCRIBER = {
  SERVING_SERVICE: 'Service',
  SERVING_API_VERSION: 'serving.knative.dev/v1',
  BROKER: 'default',
};

export const GQL_QUERIES = {
  LAMBDA: {
    ERROR_MESSAGE: `Error while fetching "{lambdaName}" Lambda: {error}`,
  },
  LAMBDAS: {
    ERROR_MESSAGE: `Error while fetching Lambdas in "{namespace}" Namespace: {error}`,
  },
  EVENT_ACTIVATIONS: {
    ERROR_MESSAGE: `Error while fetching available Events in "{namespace}" namespace: {error}`,
  },
  EVENT_TRIGGERS: {
    ERROR_MESSAGE: `Error while fetching Event Triggers for "{lambdaName}" Lambda: {error}`,
  },
  SERVICE_BINDING_USAGES: {
    ERROR_MESSAGE: `Error while fetching injected Service Binding Usages to "{lambdaName}" Lambda: {error}`,
  },
  SERVICE_INSTANCES: {
    ERROR_MESSAGE: `Error while fetching Service Instances: {error}`,
  },
};

export const GQL_MUTATIONS = {
  CREATE_LAMBDA: {
    SUCCESS_MESSAGE: `"{lambdaName}" Lambda is successfully created`,
    ERROR_MESSAGE: `Error while creating "{lambdaName}" Lambda: {error}`,
  },
  UPDATE_LAMBDA: {
    GENERAL_CONFIGURATION: {
      SUCCESS_MESSAGE: `General Configuration for "{lambdaName}" Lambda are successfully updated`,
      ERROR_MESSAGE: `Error while updating General Configuration for "{lambdaName}" Lambda: {error}`,
    },
    CODE_AND_DEPENDENCIES: {
      SUCCESS_MESSAGE: `Code and Dependencies for "{lambdaName}" Lambda are successfully updated`,
      ERROR_MESSAGE: `Error while updating Code and Dependencies for "{lambdaName}" Lambda: {error}`,
    },
    RESOURCES_AND_REPLICAS: {
      SUCCESS_MESSAGE: `Resources and Replicas for "{lambdaName}" Lambda are successfully updated`,
      ERROR_MESSAGE: `Error while updating Resources and Replicas for "{lambdaName}" Lambda: {error}`,
    },
    VARIABLES: {
      SUCCESS_MESSAGE: `Environment Variables for "{lambdaName}" Lambda are successfully updated`,
      ERROR_MESSAGE: `Error while updating Environment Variables for "{lambdaName}" Lambda: {error}`,
    },
  },
  DELETE_LAMBDA: {
    SUCCESS_MESSAGE: `"{lambdaName}" Lambda is successfully removed`,
    ERROR_MESSAGE: `Error while deleting "{lambdaName}" Lambda: {error}`,
    CONFIRM_MODAL: {
      TITLE: `Remove {lambdaName} Lambda`,
      MESSAGE: `Are you sure you want to delete "{lambdaName}" Lambda and whole related to it resources?`,
    },
  },
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

export const MODALS = {
  CREATE_BINDING: {
    CREATE_BUTTON_POPUP_MESSAGE: 'At least one event must be marked.',
  },
};

export const RESOURCES_MANAGEMENT_PANEL = {
  TITLE: 'Resources and Replicas',
  EDIT_MODAL: {
    TITLE: 'Edit Resources and Replicas Configuration',
    OPEN_BUTTON: {
      TEXT: {
        EDIT: 'Edit Configuration',
        SAVE: 'Save',
      },
    },
    CONFIRM_BUTTON: {
      TEXT: 'Save',
    },
  },
  REPLICAS_MODE: {
    MIN_NUMBER: {
      TITLE: 'Minimum number of replicas',
      DESCRIPTION: 'Set it to 0 to enable scale to zero',
    },
    MAX_NUMBER: {
      TITLE: 'Maximum number of replicas',
      DESCRIPTION: 'Set it to zero to disable lambda.',
    },
    SCALE_TO_ZERO: {
      TITLE: 'Scale to zero',
      DESCRIPTION: 'Enable scale to zero.',
    },
    FIXED: {
      TITLE: 'Fixed replicas',
      DESCRIPTION: 'Enable fixed replicas.',
    },
  },
  RESOURCES: {
    REQUESTS: {
      TITLE: 'Requests Resources',
      DESCRIPTION:
        'Requests describes the minimum amount of compute resources required.',
    },
    LIMITS: {
      TITLE: 'Limits Resources',
      DESCRIPTION:
        'Limits describes the maximum amount of compute resources allowed.',
    },
    MEMORY: {
      TITLE: 'Memory',
    },
    CPU: {
      TITLE: 'CPU',
    },
  },
};

export const EVENT_TRIGGERS_PANEL = {
  LIST: {
    TITLE: 'Event Triggers',
    ERRORS: {
      RESOURCES_NOT_FOUND: "This lambda doesn't have any Event Triggers yet.",
      NOT_MATCHING_SEARCH_QUERY:
        "Couldn't find Event Triggers matching this query.",
    },
  },
  ADD_MODAL: {
    TITLE: 'Add Event Trigger',
    OPEN_BUTTON: {
      TEXT: 'Add Event Trigger',
      NOT_ENTRIES_POPUP_MESSAGE:
        'No Events available to connect in current namespace.',
    },
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
      RESOURCES_NOT_FOUND: "This lambda doesn't have any Service Bindings yet.",
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

export const CODE_AND_DEPENDENCIES_PANEL = {
  TABS: {
    CODE: 'Lambda Code',
    DEPENDENCIES: 'Dependencies',
  },
  SAVE_BUTTON: {
    TEXT: 'Save',
    POPUP_MESSAGE: 'No changes made',
  },
  DIFF_TOGGLE: 'Diff',
};

export const FUNCTION_USAGE_KIND = 'knative-service';

export const DEFAULT_LAMBDA_CODE = `module.exports = { 
  main: function (event, context) {

  }
}`;

export const DEFAULT_LAMBDA_DEPS = `{ 
  "name": "{lambdaName}",
  "version": "1.0.0",
  "dependencies": {}
}`;
