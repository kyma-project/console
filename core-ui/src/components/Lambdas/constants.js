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
    TITLE: 'Create Function',
    OPEN_BUTTON: {
      TEXT: 'Create Function',
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

export const GQL_QUERIES = {
  LAMBDA: {
    ERROR_MESSAGE: `Couldn't fetch "{lambdaName}" due to this error: {error}`,
  },
  LAMBDAS: {
    ERROR_MESSAGE: `Couldn't fetch Functions from "{namespace}" due to this error: {error}`,
  },
  EVENT_ACTIVATIONS: {
    ERROR_MESSAGE: `Couldn't fetch available Events from "{namespace}" due to this error: {error}`,
  },
  EVENT_TRIGGERS: {
    ERROR_MESSAGE: `Couldn't fetch Event Triggers for "{lambdaName}" due to this error: {error}`,
  },
  SERVICE_BINDING_USAGES: {
    ERROR_MESSAGE: `Couldn't fetch Service Binding Usages injected in "{lambdaName}" due to this error: {error}`,
  },
  SERVICE_INSTANCES: {
    ERROR_MESSAGE: `Couldn't fetch Service Instances due to this error: {error}`,
  },
};

export const GQL_MUTATIONS = {
  CREATE_LAMBDA: {
    SUCCESS_MESSAGE: `"{lambdaName}" was successfully created`,
    ERROR_MESSAGE: `Couldn't create "{lambdaName}" due to this error: {error}`,
  },
  UPDATE_LAMBDA: {
    GENERAL_CONFIGURATION: {
      SUCCESS_MESSAGE: `General configuration for "{lambdaName}" was successfully updated`,
      ERROR_MESSAGE: `Couldn't update general configuration for "{lambdaName}" due to this error: {error}`,
    },
    CODE_AND_DEPENDENCIES: {
      SUCCESS_MESSAGE: `Code and dependencies for "{lambdaName}" were successfully updated`,
      ERROR_MESSAGE: `Couldn't update code and dependencies for "{lambdaName}" due to this error: {error}`,
    },
    RESOURCES_AND_REPLICAS: {
      SUCCESS_MESSAGE: `Resources and replicas for "{lambdaName}" were successfully updated`,
      ERROR_MESSAGE: `Couldn't update resources and replicas for "{lambdaName}" due to this error: {error}`,
    },
    VARIABLES: {
      SUCCESS_MESSAGE: `Environment variables for "{lambdaName}" were successfully updated`,
      ERROR_MESSAGE: `Couldn't update environment variables for "{lambdaName}" due to this error: {error}`,
    },
  },
  DELETE_LAMBDA: {
    SUCCESS_MESSAGE: `"{lambdaName}" was successfully deleted`,
    ERROR_MESSAGE: `Couldn't delete "{lambdaName}" due to this error: {error}`,
    CONFIRM_MODAL: {
      TITLE: `Delete {lambdaName}`,
      MESSAGE: `Are you sure you want to delete "{lambdaName}" and all related resources?`,
    },
  },
  CREATE_TRIGGERS: {
    SUCCESS_MESSAGE_SINGLE: `Event Trigger created successfully`,
    SUCCESS_MESSAGE_MANY: `Event Triggers created successfully`,
    ERROR_MESSAGE_SINGLE: `Event Trigger for "{lambdaName}" couldn't be created due to this error: {error}`,
    ERROR_MESSAGE_MANY: `Couldn't create Event Triggers for "{lambdaName}" due to this error: {error}`,
  },
  DELETE_TRIGGER: {
    SUCCESS_MESSAGE: `Event Trigger was successfully deleted`,
    ERROR_MESSAGE: `Couldn't delete the "{triggerName}" Event Trigger for the "{lambdaName}" Function due to this error: {error}`,
    CONFIRM_MODAL: {
      TITLE: `Delete Event Trigger`,
      MESSAGE: `Are you sure you want to delete the "{triggerName}" Event Trigger for the "{lambdaName}" Function?`,
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
  TITLE: 'Edit resources and replicas',
  EDIT_MODAL: {
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
      'CPU value has to be expressed as a fixed-point number or in milicpu. For example, use 100m, 0.1, or 1.',
    MEMORY:
      'Memory value has to be a fixed-point number with one of these suffixes: Gi, G, Mi, M, Ki, or K. For example, use 50Mi, 1000.5Ki, or 0.1G.',
    MIN_REPLICAS_TOO_HIGH:
      'Minimum number of replicas has to be equal to or lower than maximum.',
    MIN_REPLICAS_NON_NEGATIVE:
      'Minimum replicas must be a non-negative integer.',
    MAX_REPLICAS_TOO_LOW:
      'Maximum number of replicas has to be equal or greater than minimum.',
    MAX_REPLICAS_NON_NEGATIVE:
      'Maximum replicas must be a non-negative integer.',
  },

  REPLICAS_MODE: {
    MIN_NUMBER: {
      TITLE: 'Minimum replicas',
      DESCRIPTION: 'Minimum number of running replicas.',
    },
    MAX_NUMBER: {
      TITLE: 'Maximum replicas',
      DESCRIPTION:
        'Maximum number of running replicas. Set it to 0 to disable the function.',
    },
  },
  RESOURCES: {
    REQUESTS: {
      TITLE: 'Requests',
      DESCRIPTION: 'Minimum amount of compute resources required.',
    },
    LIMITS: {
      TITLE: 'Limits',
      DESCRIPTION: 'Maximum amount of compute resources allowed.',
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
        'No Events available to connect in this Namespace.',
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
        "This Function doesn't have any environment variables yet.",
      NOT_MATCHING_SEARCH_QUERY:
        "Couldn't find environment variables matching this query.",
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
        NO_ENVS_DEFINED: 'You must define at least one variable.',
        COLLECTIONS_EQUAL: 'Changes in variables are required.',
        ERROR:
          'At least one variable has an incorrect name format, is duplicated, or empty.',
      },
    },
    ADD_ENV_BUTTON: {
      TEXT: 'Add Environment Variable',
    },
  },
  ERRORS: {
    EMPTY: 'Variable is empty.',
    DUPLICATED: 'Duplicated variable name.',
    INVALID: `Invalid variable name. The name must consist of alphanumeric characters, can contain "_" and no spaces, like "VARIABLE_NAME".`,
  },
  WARNINGS: {
    TEXT: 'Warning',
    VARIABLE_CAN_OVERRIDE_SBU:
      'This variable can override or be overridden by a variable injected by one of the created Service Bindings.',
    SBU_CAN_BE_OVERRIDE: {
      BY_CUSTOM_ENV:
        'This variable can override or be overridden by one of the custom variables.',
      BY_SBU:
        'This variable can override or be overridden by a variable injected by one of the Service Bindings.',
      BY_CUSTOM_ENV_AND_SBU:
        'This variable can be overridden by one of the custom variables or a variable injected by one of the Service Bindings.',
    },
  },
  PLACEHOLDERS: {
    VARIABLE_NAME: 'Variable name',
    VARIABLE_VALUE: 'Variable value',
  },
  VARIABLE_TYPE: {
    CUSTOM: {
      TEXT: 'Custom',
      TOOLTIP_MESSAGE: 'This variable was provided by the user.',
    },
    BINDING_USAGE: {
      TEXT: 'Service Binding',
      TOOLTIP_MESSAGE:
        'This variable was injected by the Service Binding referencing the "{serviceInstanceName}" Service Instance.',
    },
  },
};

export const FIRST_BREADCRUMB_NODE = 'Functions';

export const REFETCH_LAMBDAS_TIMEOUT = 2000;

export const FUNCTION_CUSTOM_RESOURCE = {
  KIND: 'Function',
  API_VERSION: 'serverless.kyma-project.io/v1alpha1',
};

export const TRIGGER_SUBSCRIBER = {
  SERVING_SERVICE: 'Service',
  SERVING_API_VERSION: 'serving.knative.dev/v1',
  BROKER: 'default',
};

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
