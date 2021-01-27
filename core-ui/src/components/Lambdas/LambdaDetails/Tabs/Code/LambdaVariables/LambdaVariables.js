import React, { useState } from 'react';

import { Icon, Badge, FormMessage } from 'fundamental-react';
import { GenericList, Tooltip } from 'react-shared';

import EditVariablesModal from './EditVariablesModal';

import {
  VARIABLE_VALIDATION,
  VARIABLE_TYPE,
  WARNINGS_VARIABLE_VALIDATION,
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
  const [show, setShow] = useState(false);

  const { data, loading, error } = useQuery(GET_SECRET, {
    variables: { namespace: variable.namespace, name: variable.resourceName },
  });

  if (loading) {
    return null;
  }

  if (error) {
    console.error(error);
    return `Error: ${error}`;
  }

  if (data.secret === null) {
    return (
      <FormMessage type={'error'}>
        {ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.SECRET.ERRORS.NOT_EXIST}
      </FormMessage>
    );
  }

  if (data.secret.data[variable.resourceKey] === undefined) {
    return (
      <FormMessage type={'error'}>
        {ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.SECRET.ERRORS.KEY_NOT_EXIST}
      </FormMessage>
    );
  }

  const value = <span>{data.secret.data[variable.resourceKey] || '-'}</span>;

  const blurVariable = (
    <div
      className={!show ? 'blur-variable' : ''}
      onClick={_ => setShow(state => !state)}
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

function ConfigMapVariableValue({ variable }) {
  const { data, loading, error } = useQuery(GET_CONFIG_MAP, {
    variables: { name: variable.resourceName, namespace: variable.namespace },
  });

  if (loading) {
    return null;
  }

  if (error) {
    console.error(error);
    return `Error: ${error}`;
  }

  if (data.configMap === null) {
    return (
      <FormMessage type={'error'}>
        {ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.CONFIG_MAP.ERRORS.NOT_EXIST}
      </FormMessage>
    );
  }

  if (data.configMap.json.data[variable.resourceKey] === undefined) {
    return (
      <FormMessage type={'error'}>
        {
          ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.CONFIG_MAP.ERRORS
            .KEY_NOT_EXIST
        }
      </FormMessage>
    );
  }

  return <span>{data.configMap.json.data[variable.resourceKey] || '-'}</span>;
}

function VariableSource({ variable }) {
  if (variable.resourceName) {
    return <span>{variable.resourceName}</span>;
  }

  return <span>{'-'}</span>;
}

function VariableSourceKey({ variable }) {
  if (variable.resourceKey) {
    return <span>{variable.resourceKey}</span>;
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

    let variableValue = <VariableValue key={variable.id} variable={variable} />;
    variable.namespace = lambda.namespace;
    if (isSecretType) {
      variableValue = (
        <SecretVariableValue key={variable.id} variable={variable} />
      );
    } else if (isConfigMapType) {
      variableValue = (
        <ConfigMapVariableValue key={variable.id} variable={variable} />
      );
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
      customValueFromVariables={customValueFromVariables}
      injectedVariables={injectedVariables}
    />
  );

  const entries = [
    ...validateVariables(customVariables, injectedVariables),
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
