import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { FormItem, FormInput, FormMessage } from 'fundamental-react';

import { VARIABLE_VALIDATION } from 'components/Lambdas/helpers/lambdaVariables';
import { ENVIRONMENT_VARIABLES_PANEL } from 'components/Lambdas/constants';
import { CONFIG } from 'components/Lambdas/config';

import { getValidationStatus, validateVariable } from './validation';

export default function SingleVariableInput({
  currentVariable = {},
  variables = [],
  injectedVariables = [],
  onUpdateVariables,
  setValidity,
  setInvalidModalPopupMessage,
}) {
  const [variable, setVariable] = useState(currentVariable);
  const [debouncedCallback] = useDebouncedCallback(newVariable => {
    onUpdateVariables(newVariable);
  }, 200);

  useEffect(() => {
    setValidity(false);
  }, [setValidity]);

  useEffect(() => {
    setVariable(currentVariable);
  }, [currentVariable]);

  useEffect(() => {
    const validate = validateVariable(variables, variable);
    setValidity(validate);

    if (!validate) {
      setInvalidModalPopupMessage(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.POPUP_MESSAGES
          .ERROR,
      );
    }
  }, [
    variables,
    variable,
    setValidity,
    setInvalidModalPopupMessage,
    debouncedCallback,
  ]);

  function onChangeName(event) {
    const name = event.target.value;
    const validation = getValidationStatus({
      userVariables: variables,
      injectedVariables,
      restrictedVariables: CONFIG.restrictedVariables,
      varName: name,
      varID: variable.id,
      varDirty: variable.dirty,
    });
    const newVariable = {
      ...variable,
      validation,
      name,
      dirty: true,
    };
    setVariable(newVariable);
    debouncedCallback(newVariable);
  }

  function onChangeValue(event) {
    const value = event.target.value;
    const newVariable = {
      ...variable,
      value,
      dirty: true,
    };
    setVariable(newVariable);
    debouncedCallback(newVariable);
  }

  function renderValidationContent() {
    const { validation } = variable;

    if (validation === VARIABLE_VALIDATION.NONE) {
      return null;
    }

    let type = undefined;
    let message = '';
    switch (validation) {
      case VARIABLE_VALIDATION.EMPTY:
        type = 'error';
        message = ENVIRONMENT_VARIABLES_PANEL.ERRORS.EMPTY;
        break;
      case VARIABLE_VALIDATION.INVALID:
        type = 'error';
        message = ENVIRONMENT_VARIABLES_PANEL.ERRORS.INVALID;
        break;
      case VARIABLE_VALIDATION.DUPLICATED:
        type = 'error';
        message = ENVIRONMENT_VARIABLES_PANEL.ERRORS.DUPLICATED;
        break;
      case VARIABLE_VALIDATION.RESTRICTED:
        type = 'error';
        message = ENVIRONMENT_VARIABLES_PANEL.ERRORS.RESTRICTED;
        break;
      case VARIABLE_VALIDATION.CAN_OVERRIDE_SBU:
        type = 'warning';
        message =
          ENVIRONMENT_VARIABLES_PANEL.WARNINGS.VARIABLE_CAN_OVERRIDE_SBU;
        break;
      default:
        return null;
    }

    return (
      <td colSpan="3">
        <FormMessage type={type}>{message}</FormMessage>
      </td>
    );
  }

  return {
    cells: [
      <FormItem>
        <FormInput
          id={`variableName-${currentVariable.id}`}
          placeholder={ENVIRONMENT_VARIABLES_PANEL.PLACEHOLDERS.VARIABLE_NAME}
          type="text"
          value={variable.name}
          onChange={onChangeName}
        />
      </FormItem>,
      <span className="sap-icon--arrow-right"></span>,
      <FormItem>
        <FormInput
          id={`variableValue-${currentVariable.id}`}
          placeholder={ENVIRONMENT_VARIABLES_PANEL.PLACEHOLDERS.VARIABLE_VALUE}
          type="text"
          value={variable.value}
          onChange={onChangeValue}
        />
      </FormItem>,
    ],
    collapseContent: renderValidationContent(),
    withCollapseControl: false,
  };
}
