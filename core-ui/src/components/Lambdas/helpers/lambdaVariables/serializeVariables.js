import { newVariableModel } from './newVariableModel';
import { VARIABLE_TYPE, VARIABLE_VALIDATION } from './constants';

export function serializeVariables({
  lambdaVariables = [],
  bindingUsages = [],
}) {
  const bindingUsageVariableNames = [];
  let bindingUsageVariables = bindingUsages.flatMap(bindingUsage => {
    const variables = retrieveVariablesFromBindingUsage(bindingUsage);
    bindingUsageVariableNames.push(...variables);
    return {
      bindingUsage,
      variables,
    };
  });

  const customVariablesNames = [];
  const customVariables = [];
  const customValueFromVariables = [];

  lambdaVariables.forEach(variable => {
    // at the moment save custom variables with valueFrom field in separate array
    // we don't support yet defining in UI variables with configMapKeyRef and secretKeyRef
    const isValueFromVariable =
      variable.valueFrom && Object.keys(variable.valueFrom).length;
    if (isValueFromVariable) {
      customValueFromVariables.push(variable);
      return;
    }

    customVariablesNames.push(variable.name);
    customVariables.push(
      newVariableModel({
        type: VARIABLE_TYPE.CUSTOM,
        variable: {
          name: variable.name,
          value: variable.value,
        },
        additionalProps: { dirty: true },
      }),
    );
  });

  bindingUsageVariables = bindingUsageVariables.flatMap(
    ({ variables, bindingUsage }) => {
      const serializedInjectedVariables = [];

      variables.forEach(variableName => {
        let validation = VARIABLE_VALIDATION.NONE;

        const canOverrideByCustomVar = customVariablesNames.includes(
          variableName,
        );
        const canOverrideBySBU =
          bindingUsageVariableNames.filter(v => v === variableName).length > 1;

        if (canOverrideByCustomVar && canOverrideBySBU) {
          validation = VARIABLE_VALIDATION.CAN_OVERRIDE_BY_CUSTOM_ENV_AND_SBU;
        } else if (canOverrideByCustomVar) {
          validation = VARIABLE_VALIDATION.CAN_OVERRIDE_BY_CUSTOM_ENV;
        } else if (canOverrideBySBU) {
          validation = VARIABLE_VALIDATION.CAN_OVERRIDE_BY_SBU;
        }

        const newVariable = newVariableModel({
          type: VARIABLE_TYPE.BINDING_USAGE,
          variable: {
            name: variableName,
          },
          validation,
          additionalProps: {
            serviceInstanceName:
              bindingUsage.serviceBinding.serviceInstanceName,
          },
        });
        serializedInjectedVariables.push(newVariable);
      });

      return serializedInjectedVariables;
    },
  );

  return {
    customVariables,
    customValueFromVariables,
    injectedVariables: bindingUsageVariables,
  };
}

export function retrieveVariablesFromBindingUsage(bindingUsage) {
  let envPrefix = '';
  if (bindingUsage.parameters && bindingUsage.parameters.envPrefix) {
    envPrefix = bindingUsage.parameters.envPrefix.name || '';
  }

  const secretData =
    bindingUsage.serviceBinding &&
    bindingUsage.serviceBinding.secret &&
    bindingUsage.serviceBinding.secret.data;

  const envs = Object.keys(secretData || {});
  if (!envs.length) {
    return [];
  }

  return envs.map(env => `${envPrefix}${env}`);
}
