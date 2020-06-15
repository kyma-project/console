import {
  VARIABLE_TYPE,
  VARIABLE_VALIDATION,
  ERROR_VARIABLE_VALIDATION,
} from 'components/Lambdas/helpers/lambdaVariables';
import { CONFIG } from 'components/Lambdas/config';

export function validateVariables(
  customVariables = [],
  injectedVariables = [],
  restrictedVariables = [],
) {
  return customVariables.map((variable, _, array) => {
    const validation = getValidationStatus({
      userVariables: array,
      injectedVariables,
      restrictedVariables: restrictedVariables,
      varName: variable.name,
      varID: variable.id,
      varDirty: variable.dirty,
    });

    return {
      ...variable,
      validation,
    };
  });
}

export function validateVariable(variables = [], currentVariable = {}) {
  if (!currentVariable.name) {
    return false;
  }
  if (ERROR_VARIABLE_VALIDATION.includes(currentVariable.validation)) {
    return false;
  }

  // exclude currentVariable, because variables array include old currentVariable
  const someVarIsEmpty = variables.some(
    env => currentVariable.id !== env.id && !env.name,
  );
  if (someVarIsEmpty) {
    return false;
  }

  // exclude currentVariable, because variables array include old currentVariable
  const someVarHasError = variables.some(
    env =>
      currentVariable.id !== env.id &&
      ERROR_VARIABLE_VALIDATION.includes(env.validation),
  );
  if (someVarHasError) {
    return false;
  }

  return true;
}

export function getValidationStatus({
  userVariables = [],
  injectedVariables = [],
  restrictedVariables = [],
  varName,
  varID,
  varDirty = false,
}) {
  // empty
  if (!varName) {
    if (varDirty) {
      return VARIABLE_VALIDATION.EMPTY;
    }
    return VARIABLE_VALIDATION.NONE;
  }

  if (restrictedVariables.includes(varName)) {
    return VARIABLE_VALIDATION.RESTRICTED;
  }

  // invalidate
  const regex = /^[a-zA-Z]([a-zA-Z0-9_]*)$/;
  if (!varName || !regex.test(varName)) {
    return VARIABLE_VALIDATION.INVALID;
  }

  // duplicated
  if (
    userVariables.some(
      variable => variable.id !== varID && variable.name === varName,
    )
  ) {
    return VARIABLE_VALIDATION.DUPLICATED;
  }

  // override SBU
  if (
    injectedVariables.some(
      variable =>
        variable.type === VARIABLE_TYPE.BINDING_USAGE &&
        variable.name === varName,
    )
  ) {
    return VARIABLE_VALIDATION.CAN_OVERRIDE_SBU;
  }

  return VARIABLE_VALIDATION.NONE;
}
