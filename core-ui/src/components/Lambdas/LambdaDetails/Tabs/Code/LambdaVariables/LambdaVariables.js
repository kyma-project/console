import React, { useState } from 'react';

import { Icon, Badge } from 'fundamental-react';
import { GenericList, Tooltip } from 'react-shared';

import EditVariablesModal from './EditVariablesModal';

import {
  VARIABLE_VALIDATION,
  VARIABLE_TYPE,
  WARNINGS_VARIABLE_VALIDATION,
  newVariableModel,
} from 'components/Lambdas/helpers/lambdaVariables';
import { ENVIRONMENT_VARIABLES_PANEL } from 'components/Lambdas/constants';

import { validateVariables } from './validation';

import './LambdaEnvs.scss';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { useQuery } from '@apollo/react-hooks';
import { GET_SECRET } from '../../../../../../gql/queries';
import { GET_CONFIG_MAP } from '../../../../gql/queries';

const headerRenderer = () => [
  'Variable Name',
  '',
  'Value',
  'Resource Name',
  'Key',
  'Type',
  '',
];
const textSearchProperties = ['name', 'value', 'type'];

function VariableStatus({ validation }) {
  if (!WARNINGS_VARIABLE_VALIDATION.includes(validation)) {
    return null;
  }

  const statusClassName = 'fd-has-color-status-2';
  const control = (
    <div>
      <span className={statusClassName}>
        {ENVIRONMENT_VARIABLES_PANEL.WARNINGS.TEXT}
      </span>
      <Icon
        glyph="message-warning"
        size="s"
        className={`${statusClassName} fd-has-margin-left-tiny`}
      />
    </div>
  );

  let message = '';
  switch (validation) {
    case VARIABLE_VALIDATION.CAN_OVERRIDE_SBU: {
      message = ENVIRONMENT_VARIABLES_PANEL.WARNINGS.VARIABLE_CAN_OVERRIDE_SBU;
      break;
    }
    case VARIABLE_VALIDATION.CAN_OVERRIDE_BY_CUSTOM_ENV_AND_SBU: {
      message =
        ENVIRONMENT_VARIABLES_PANEL.WARNINGS.SBU_CAN_BE_OVERRIDE
          .BY_CUSTOM_ENV_AND_SBU;
      break;
    }
    case VARIABLE_VALIDATION.CAN_OVERRIDE_BY_CUSTOM_ENV: {
      message =
        ENVIRONMENT_VARIABLES_PANEL.WARNINGS.SBU_CAN_BE_OVERRIDE.BY_CUSTOM_ENV;
      break;
    }
    case VARIABLE_VALIDATION.CAN_OVERRIDE_BY_SBU: {
      message = ENVIRONMENT_VARIABLES_PANEL.WARNINGS.SBU_CAN_BE_OVERRIDE.BY_SBU;
      break;
    }
    default: {
      message = ENVIRONMENT_VARIABLES_PANEL.WARNINGS.VARIABLE_CAN_OVERRIDE_SBU;
    }
  }

  return <Tooltip content={message}>{control}</Tooltip>;
}

function VariableType({ variable }) {
  let message = ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.CUSTOM;
  let tooltipTitle = message.TOOLTIP_MESSAGE;

  if (variable.type === VARIABLE_TYPE.BINDING_USAGE) {
    message = ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.BINDING_USAGE;
    tooltipTitle = formatMessage(message.TOOLTIP_MESSAGE, {
      serviceInstanceName: variable.serviceInstanceName,
    });
  }

  if (variable.type === VARIABLE_TYPE.CONFIG_MAP) {
    message = ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.CONFIG_MAP;
    tooltipTitle = message.TOOLTIP_MESSAGE;
  }

  if (variable.type === VARIABLE_TYPE.SECRET) {
    message = ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.SECRET;
    tooltipTitle = message.TOOLTIP_MESSAGE;
  }

  return (
    <Tooltip content={tooltipTitle}>
      <Badge>{message.TEXT}</Badge>
    </Tooltip>
  );
}

function VariableValue({ variable }) {
  const isBindingUsageVar = variable.type === VARIABLE_TYPE.BINDING_USAGE;
  const [show, setShow] = useState(false);
  const value = <span>{variable.value || '-'}</span>;

  if (isBindingUsageVar) {
    const blurVariable = (
      <div
        className={!show ? 'blur-variable' : ''}
        onClick={_ => setShow(!show)}
      >
        {value}
      </div>
    );
    return (
      <div className="lambda-variable">
        <Tooltip
          content={
            show
              ? ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.BINDING_USAGE
                  .HIDE_VALUE_MESSAGE
              : ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.BINDING_USAGE
                  .SHOW_VALUE_MESSAGE
          }
        >
          {blurVariable}
        </Tooltip>
      </div>
    );
  }
  return value;
}

function SecretVariableValue({ variable }) {
  const isSecretVar = variable.type === VARIABLE_TYPE.SECRET;
  const [show, setShow] = useState(false);

  const { data, loading, error } = useQuery(GET_SECRET, {
    variables: { namespace: variable.namespace, name: variable.resourceName },
  });

  if (loading) return null;
  if (error) return `Error: ${error}`;

  if (data.secret === null) {
    return <span style={{ color: 'red' }}>{'The Secret does not exist!'}</span>;
  }

  if (data.secret.data[variable.key] === undefined) {
    return (
      <span style={{ color: 'red' }}>
        {'There is no such key in the Secret!'}
      </span>
    );
  }

  const value = <span>{data.secret.data[variable.key] || '-'}</span>;

  if (isSecretVar) {
    const blurVariable = (
      <div
        className={!show ? 'blur-variable' : ''}
        onClick={_ => setShow(!show)}
      >
        {value}
      </div>
    );
    return (
      <div className="lambda-variable">
        <Tooltip
          content={
            show
              ? ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.BINDING_USAGE
                  .HIDE_VALUE_MESSAGE
              : ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.BINDING_USAGE
                  .SHOW_VALUE_MESSAGE
          }
        >
          {blurVariable}
        </Tooltip>
      </div>
    );
  }
  return value;
}

function ConfigMapVariableValue({ variable }) {
  const { data, loading, error } = useQuery(GET_CONFIG_MAP, {
    variables: { name: variable.resourceName, namespace: variable.namespace },
  });

  if (loading) return null;
  if (error) return `Error: ${error}`;

  if (data.configMap === null) {
    return (
      <span style={{ color: 'red' }}>{'The Config Map does not exist!'}</span>
    );
  }

  if (data.configMap.json.data[variable.key] === undefined) {
    return (
      <span style={{ color: 'red' }}>
        {'There is no such key in the Config Map!'}
      </span>
    );
  }

  return <span>{data.configMap.json.data[variable.key] || '-'}</span>;
}

function VariableSource({ variable }) {
  if (variable.resourceName) {
    return <span>{variable.resourceName}</span>;
  }

  return <span>{'-'}</span>;
}

function VariableSourceKey({ variable }) {
  if (variable.key) {
    return <span>{variable.key}</span>;
  }

  return <span>{'-'}</span>;
}

export default function LambdaEnvs({
  lambda,
  customVariables,
  customValueFromVariables,
  injectedVariables,
}) {
  const rowRenderer = variable => {
    const isConfigMapType = variable.type === VARIABLE_TYPE.CONFIG_MAP;
    const isSecretType = variable.type === VARIABLE_TYPE.SECRET;

    let variableValue = <VariableValue variable={variable} />;
    variable.namespace = lambda.namespace;
    if (isSecretType) {
      variableValue = <SecretVariableValue variable={variable} />;
    } else if (isConfigMapType) {
      variableValue = <ConfigMapVariableValue variable={variable} />;
    }

    return [
      <span>{variable.name}</span>,
      <span className="sap-icon--arrow-right" />,
      [variableValue],
      <VariableSource variable={variable} />,
      <VariableSourceKey variable={variable} />,
      <VariableType variable={variable} />,
      <VariableStatus validation={variable.validation} />,
    ];
  };

  const editEnvsModal = (
    <EditVariablesModal
      lambda={lambda}
      customVariables={customVariables}
      // customValueFromVariables={customValueFromVariables} allow to edit envs from cm's and secrets https://github.com/kyma-project/kyma/issues/10311
      injectedVariables={injectedVariables}
    />
  );

  const entries = [
    ...validateVariables(
      customVariables,
      customValueFromVariables,
      injectedVariables,
    ),
    ...customValueFromVariables,
    ...injectedVariables,
  ];

  return (
    <div className="lambda-variables">
      <GenericList
        title={ENVIRONMENT_VARIABLES_PANEL.LIST.TITLE}
        showSearchField={true}
        showSearchSuggestion={false}
        textSearchProperties={textSearchProperties}
        extraHeaderContent={editEnvsModal}
        entries={entries}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        notFoundMessage={
          ENVIRONMENT_VARIABLES_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND
        }
        noSearchResultMessage={
          ENVIRONMENT_VARIABLES_PANEL.LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY
        }
      />
    </div>
  );
}
