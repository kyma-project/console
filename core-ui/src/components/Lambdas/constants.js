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

export const LAMBDA_PHASES = {
  INITIALIZING: {
    TYPE: 'INITIALIZING',
    TITLE: 'Initializing',
  },
  BUILDING: {
    TYPE: 'BUILDING',
    TITLE: 'Building',
  },
  DEPLOYING: {
    TYPE: 'DEPLOYING',
    TITLE: 'Deploying',
  },
  RUNNING: {
    TYPE: 'RUNNING',
    TITLE: 'Running',
  },
  NEW_REVISION_ERROR: {
    TYPE: 'NEW_REVISION_ERROR',
    TITLE: 'New Revision Error',
    MESSAGE: `A new revision couldn't be created due to an error.`,
  },
  FAILED: {
    TYPE: 'FAILED',
    TITLE: 'Failed',
    MESSAGE: `Function couldn't be processed.`,
  },
  ERROR_SUFFIX: 'Error: {error}',
};

export const LAMBDA_ERROR_PHASES = [
  LAMBDA_PHASES.FAILED.TYPE,
  LAMBDA_PHASES.NEW_REVISION_ERROR.TYPE,
];

export const TOOLBAR = {
  TITLE: 'Functions',
  DESCRIPTION:
    'Extend your applications with Functions that you can trigger with incoming events and expose outside the cluster with API Rules.',
};

export const LAMBDAS_LIST = {
  ERRORS: {
    RESOURCES_NOT_FOUND: "This Namespace doesn't have any Functions yet.",
    NOT_MATCHING_SEARCH_QUERY: "Couldn't find Functions matching this query.",
  },
  CREATE_MODAL: {
    TITLE: 'Create new Function',
    OPEN_BUTTON: {
      TEXT: 'Create new Function',
    },
    CONFIRM_BUTTON: {
      TEXT: 'Create',
    },
    INPUTS: {
      NAME: {
        LABEL: 'Name',
        INLINE_HELP: `The name must consist of lower case alphanumeric characters or dashes, and must start and end with an alphanumeric character (e.g. 'my-name1').`,
      },
      LABEL: {
        LABEL: 'Labels',
        INLINE_HELP: `The key/value pair should be separated by '=', consist of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character. The key cannot be empty.`,
      },
    },
  },
};

export const LAMBDA_DETAILS = {
  STATUS: {
    TITLE: 'Status',
    ERROR: {
      LINK: 'See error logs.',
      MODAL: {
        TITLE: 'Error logs from "{lambdaName}"',
      },
    },
  },
  LABELS: {
    TITLE: 'Labels',
    POPUP_MESSAGE: 'Edit Labels',
    EDIT_MODAL: {
      TITLE: 'Edit Labels',
      CONFIRM_BUTTON: {
        TEXT: 'Save',
        INVALID_POPUP_MESSAGE: 'Invalid label',
      },
    },
  },
  TABS: {
    CODE: {
      TITLE: 'Code',
    },
    CONFIGURATION: {
      TITLE: 'Configuration',
    },
  },
};

export const LOGS_AND_METRICS = {
  LOGS: {
    SPLIT_VIEW: {
      TITLE: 'Logs',
    },
    MODAL: {
      TITLE: 'Logs from "{lambdaName}"',
    },
  },
};

export const TRIGGER_SUBSCRIBER = {
  SERVING_SERVICE: 'Service',
  SERVING_API_VERSION: 'serving.knative.dev/v1',
  BROKER: 'default',
};

export const GQL_QUERIES = {
  LAMBDA: {
    ERROR_MESSAGE: `Error while fetching "{lambdaName}" Function: {error}`,
  },
  LAMBDAS: {
    ERROR_MESSAGE: `Error while fetching Functions in "{namespace}" Namespace: {error}`,
  },
  EVENT_ACTIVATIONS: {
    ERROR_MESSAGE: `Error while fetching available Events in "{namespace}" namespace: {error}`,
  },
  EVENT_TRIGGERS: {
    ERROR_MESSAGE: `Error while fetching Event Triggers for "{lambdaName}" Function: {error}`,
  },
  SERVICE_BINDING_USAGES: {
    ERROR_MESSAGE: `Error while fetching injected Service Binding Usages to "{lambdaName}" Function: {error}`,
  },
  SERVICE_INSTANCES: {
    ERROR_MESSAGE: `Error while fetching Service Instances: {error}`,
  },
};

export const GQL_MUTATIONS = {
  CREATE_LAMBDA: {
    SUCCESS_MESSAGE: `"{lambdaName}" Function is successfully created`,
    ERROR_MESSAGE: `Error while creating "{lambdaName}" Function: {error}`,
  },
  UPDATE_LAMBDA: {
    GENERAL_CONFIGURATION: {
      SUCCESS_MESSAGE: `General Configuration for "{lambdaName}" Function are successfully updated`,
      ERROR_MESSAGE: `Error while updating General Configuration for "{lambdaName}" Function: {error}`,
    },
    CODE_AND_DEPENDENCIES: {
      SUCCESS_MESSAGE: `Code and Dependencies for "{lambdaName}" Function are successfully updated`,
      ERROR_MESSAGE: `Error while updating Code and Dependencies for "{lambdaName}" Function: {error}`,
    },
    RESOURCES_AND_REPLICAS: {
      SUCCESS_MESSAGE: `Resources and Replicas for "{lambdaName}" Function are successfully updated`,
      ERROR_MESSAGE: `Error while updating Resources and Replicas for "{lambdaName}" Function: {error}`,
    },
    VARIABLES: {
      SUCCESS_MESSAGE: `Environment Variables for "{lambdaName}" Function are successfully updated`,
      ERROR_MESSAGE: `Error while updating Environment Variables for "{lambdaName}" Function: {error}`,
    },
  },
  DELETE_LAMBDA: {
    SUCCESS_MESSAGE: `"{lambdaName}" Function is successfully removed`,
    ERROR_MESSAGE: `Error while deleting "{lambdaName}" Function: {error}`,
    CONFIRM_MODAL: {
      TITLE: `Remove {lambdaName} Function`,
      MESSAGE: `Are you sure you want to delete "{lambdaName}" Function and whole related to it resources?`,
    },
  },
  CREATE_TRIGGERS: {
    SUCCESS_MESSAGE_SINGLE: `Event Trigger created successfully`,
    SUCCESS_MESSAGE_MANY: `Event Triggers created successfully`,
    ERROR_MESSAGE_SINGLE: `Error while creating an Event Trigger for "{lambdaName}" Function: {error}`,
    ERROR_MESSAGE_MANY: `Error while creating Event Triggers for "{lambdaName}" Function: {error}`,
  },
  DELETE_TRIGGER: {
    SUCCESS_MESSAGE: `Event Trigger was successfully removed`,
    ERROR_MESSAGE: `Error while deleting "{triggerName}" Event Trigger for "{lambdaName}" Function: {error}`,
    CONFIRM_MODAL: {
      TITLE: `Remove Event Trigger`,
      MESSAGE: `Are you sure you want to delete "{triggerName}" Event Trigger for "{lambdaName}" Function?`,
    },
  },
  CREATE_BINDING_USAGE: {
    SUCCESS_MESSAGE: `Service Binding referencing the "{serviceInstanceName}" Service Instance was successfully created`,
    ERROR_MESSAGE: `Couldn't create a Service Binding referencing the "{serviceInstanceName}" Service Instance due to this error: {error}`,
  },
  DELETE_BINDING_USAGE: {
    SUCCESS_MESSAGE: `Service Binding referencing the "{serviceInstanceName}" Service Instance was successfully deleted`,
    ERROR_MESSAGE: `Couldn't delete the Service Binding referencing the "{serviceInstanceName}" Service Instance due to this error: {error}`,
    CONFIRM_MODAL: {
      TITLE: `Delete Service Binding`,
      MESSAGE: `Are you sure you want to delete the Service Binding referencing the "{serviceInstanceName}" Service Instance?`,
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
  ERROR_MESSAGES: {
    CPU:
      'CPU value has to be expressed as  fixed-point number or in "milicpu", example: 100m, 0.1, 1',
    MEMORY:
      'Memory value has to be fixed-point number using one of these suffixes: Gi, Mi, Ki. Example: 50Mi, 1000.5Ki, 0.1Gi',
    MIN_REPLICAS_TOO_HIGH:
      'Minimum number of replicas has to be equal to or lower than maximum',
    MIN_REPLICAS_NON_NEGATIVE: 'Minimum replicas must be non-negative integer',
    MAX_REPLICAS_TOO_LOW:
      'Maximum number of replicas has to be equal or greater than minimum',
    MAX_REPLICAS_NON_NEGATIVE: 'Maximum replicas must be non-negative integer',
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
      RESOURCES_NOT_FOUND: "This Function doesn't have any Event Triggers yet.",
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
      RESOURCES_NOT_FOUND:
        "This Function doesn't have any Service Bindings yet.",
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
    CODE: 'Source',
    DEPENDENCIES: 'Dependencies',
  },
  SAVE_BUTTON: {
    TEXT: 'Save',
    POPUP_MESSAGE: 'No changes made',
  },
  DIFF_TOGGLE: 'Diff',
};

export const ENVIRONMENT_VARIABLES_PANEL = {
  LIST: {
    TITLE: 'Environment Variables',
    ERRORS: {
      RESOURCES_NOT_FOUND:
        "This lambda doesn't have any Environment Variables yet.",
      NOT_MATCHING_SEARCH_QUERY:
        "Couldn't find Environment Variables matching this query.",
    },
  },
  EDIT_MODAL: {
    TITLE: 'Edit Environment Variables',
    OPEN_BUTTON: {
      TEXT: 'Edit Environment Variables',
    },
    CONFIRM_BUTTON: {
      TEXT: 'Save',
      POPUP_MESSAGES: {
        NO_ENVS_DEFINED: 'At least one Variable must be defined.',
        COLLECTIONS_EQUAL: 'Changes in Variables are required.',
        ERROR:
          'At least one Variable is duplicated, has wrong name format or is empty.',
      },
    },
    ADD_ENV_BUTTON: {
      TEXT: 'Add new Variable',
    },
  },
  ERRORS: {
    EMPTY: 'Variable is empty.',
    DUPLICATED: 'Duplicated Variable name.',
    INVALID:
      'Invalid Variable name: must consist of alphanumeric characters or "_" and no spaces (for example "VARIABLE_NAME").',
  },
  WARNINGS: {
    TEXT: 'Warning',
    VARIABLE_CAN_OVERRIDE_SBU:
      'The Variable can override Variable injected by one of the created Service Bindings.',
    SBU_CAN_BE_OVERRIDE: {
      BY_CUSTOM_ENV: 'The Variable can be override by one of custom Variables.',
      BY_SBU:
        'The Variable can be override by Variable injected by one of the created Service Bindings.',
      BY_CUSTOM_ENV_AND_SBU:
        'The Variable can be override by one of custom Variables or Variable injected by one of the created Service Bindings.',
    },
  },
  PLACEHOLDERS: {
    VARIABLE_NAME: 'Variable Name',
    VARIABLE_VALUE: 'Variable Value',
  },
  VARIABLE_TYPE: {
    CUSTOM: {
      TEXT: 'Custom',
      TOOLTIP_MESSAGE: 'The Variable is provided by User.',
    },
    BINDING_USAGE: {
      TEXT: 'Service Binding',
      TOOLTIP_MESSAGE:
        'The Variable is injected by Service Binding from "{serviceInstanceName}" Service Instance.',
    },
  },
};

export const FIRST_BREADCRUMB_NODE = 'Functions';

export const FUNCTION_USAGE_KIND = 'function';

export const REFETCH_LAMBDAS_TIMEOUT = 2000;

export const DEFAULT_LAMBDA_CODE = `module.exports = { 
  main: function (event, context) {
    return "Hello World!";
  }
}`;

export const DEFAULT_LAMBDA_DEPS = `{ 
  "name": "{lambdaName}",
  "version": "1.0.0",
  "dependencies": {}
}`;
