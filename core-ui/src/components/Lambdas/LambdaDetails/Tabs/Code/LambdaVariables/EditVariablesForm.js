import React, { useState, useEffect } from 'react';

import { Button } from 'fundamental-react';
import { GenericList } from 'react-shared';

import SingleVariableInput from './SingleVariableInput';

import { useUpdateLambda, UPDATE_TYPE } from 'components/Lambdas/gql/hooks';
import {
  newVariableModel,
  VARIABLE_TYPE,
  ERROR_VARIABLE_VALIDATION,
} from 'components/Lambdas/helpers/lambdaVariables';
import { ENVIRONMENT_VARIABLES_PANEL } from 'components/Lambdas/constants';

import { validateVariables } from './validation';

const headerRenderer = () => ['Variable Name', '', 'Value'];
const textSearchProperties = ['name', 'value'];

export default function EditVariablesForm({
  lambda,
  customVariables = [],
  customValueFromVariables = [],
  injectedVariables = [],
  formElementRef,
  setValidity = () => void 0,
  setCustomValid = () => void 0,
  setInvalidModalPopupMessage = () => void 0,
}) {
  const updateLambdaVariables = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.VARIABLES,
  });
  const [variables, setVariables] = useState(
    validateVariables(customVariables, injectedVariables),
  );

  useEffect(() => {
    // in case when custom variables are defined, user should have possibility to delete them
    // otherwise show message, that at least one env must be defined to make changes on Function CR
    if (!variables.length && !customVariables.length) {
      setValidity(false);
      setInvalidModalPopupMessage(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.POPUP_MESSAGES
          .NO_ENVS_DEFINED,
      );
      return;
    }

    // check if some variable has error validation - warnings are allowed
    const hasError = variables.some(v =>
      ERROR_VARIABLE_VALIDATION.includes(v.validation),
    );
    if (hasError) {
      setValidity(false);
      setInvalidModalPopupMessage(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.POPUP_MESSAGES
          .ERROR,
      );
      return;
    }

    setInvalidModalPopupMessage('');
  }, [setValidity, variables, customVariables, setInvalidModalPopupMessage]);

  function onUpdateVariables(variable) {
    let newVariables = variables.map(oldVariable => {
      if (oldVariable.id === variable.id) {
        return {
          ...oldVariable,
          ...variable,
        };
      }
      return oldVariable;
    });
    newVariables = validateVariables(newVariables, injectedVariables);
    setVariables(newVariables);
  }

  function onDeleteVariables(variable) {
    let newVariables = variables.filter(
      oldVariable => oldVariable.id !== variable.id,
    );
    newVariables = validateVariables(newVariables, injectedVariables);
    setVariables(newVariables);
  }

  function prepareVariablesMutationInput(variables) {
    return variables.map(variable => ({
      name: variable.name,
      value: variable.value,
    }));
  }

  function prepareValueFromVariable(variable, type) {
    return {
      name: variable.name,
      value: '',
      valueFrom: {
        type: type,
        name: variable.resourceName,
        key: variable.resourceKey,
      },
    };
  }

  function prepareValueFromVariablesMutationInput(customValueFromVariables) {
    return customValueFromVariables.map(variable => {
      if (variable.type === VARIABLE_TYPE.CONFIG_MAP) {
        return prepareValueFromVariable(variable, 'ConfigMap');
      } else if (variable.type === VARIABLE_TYPE.SECRET) {
        return prepareValueFromVariable(variable, 'Secret');
      } else {
        return {};
      }
    });
  }

  function handleFormSubmit(variables, customValueFromVariables) {
    const preparedVariable = prepareVariablesMutationInput(variables);
    const preparedValueFromVariables = prepareValueFromVariablesMutationInput(
      customValueFromVariables,
    );

    updateLambdaVariables({
      env: [...preparedVariable, ...preparedValueFromVariables],
    });
  }

  const actions = [
    {
      name: 'Delete',
      handler: variable => onDeleteVariables(variable),
    },
  ];
  const rowRenderer = variable =>
    SingleVariableInput({
      currentVariable: variable,
      variables,
      injectedVariables,
      onUpdateVariables,
      setValidity,
      setCustomValid,
      setInvalidModalPopupMessage,
    });

  function addNewVariable() {
    setVariables(vars => [
      newVariableModel({
        type: VARIABLE_TYPE.CUSTOM,
        additionalProps: { dirty: false },
      }),
      ...vars,
    ]);
  }

  const addNewVariableButton = (
    <Button glyph="add" typeAttr="button" onClick={addNewVariable}>
      {ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.ADD_ENV_BUTTON.TEXT}
    </Button>
  );

  return (
    <form
      ref={formElementRef}
      onSubmit={() => {
        handleFormSubmit(variables, customValueFromVariables);
      }}
      className="edit-lambda-variables-form"
    >
      <GenericList
        entries={variables}
        textSearchProperties={textSearchProperties}
        extraHeaderContent={addNewVariableButton}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        actions={actions}
        showSearchField={true}
        showSearchSuggestion={false}
        hasExternalMargin={false}
        notFoundMessage={
          ENVIRONMENT_VARIABLES_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND
        }
        noSearchResultMessage={
          ENVIRONMENT_VARIABLES_PANEL.LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY
        }
      />
    </form>
  );
}
