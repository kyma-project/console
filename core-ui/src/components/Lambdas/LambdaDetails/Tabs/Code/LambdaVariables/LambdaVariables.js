import React from 'react';

import { Icon, Badge } from 'fundamental-react';
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

const headerRenderer = () => ['Variable Name', '', 'Value', 'Type', ''];
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

  return (
    <Tooltip content={tooltipTitle}>
      <Badge>{message.TEXT}</Badge>
    </Tooltip>
  );
}

export default function LambdaEnvs({
  lambda,
  customVariables,
  customValueFromVariables,
  injectedVariables,
}) {
  const rowRenderer = variable => [
    <span>{variable.name}</span>,
    <span className="sap-icon--arrow-right" />,
    <span>{variable.value || '-'}</span>,
    <VariableType variable={variable} />,
    <VariableStatus validation={variable.validation} />,
  ];

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
