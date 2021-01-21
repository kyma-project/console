import { newVariableModel } from './newVariableModel';
import { VARIABLE_TYPE, VARIABLE_VALIDATION } from './constants';

export function serializeVariables({
  lambdaVariables = [],
  bindingUsages = [],
}) {
  const bindingUsageVariableNames = [];
  let bindingUsageVariables = bindingUsages.flatMap(bindingUsage => {
    const variables = retrieveVariablesFromBindingUsage(bindingUsage);
    bindingUsageVariableNames.push(...variables.map(v => v.key));
    return {
      bindingUsage,
      variables,
    };
  });

  const customVariablesNames = [];
  const customVariables = [];
  const customValueFromVariables = [];

  lambdaVariables.forEach(variable => {
    const isValueFromVariable =
      variable.valueFrom && Object.keys(variable.valueFrom).length;

    if (isValueFromVariable) {
      let varModel = newVariableModel({
        variable: variable,
        additionalProps: {
          resourceKey: variable.valueFrom.key,
          resourceName: variable.valueFrom.name,
        },
      });

      if (variable.valueFrom.type === 'Secret') {
        varModel.type = VARIABLE_TYPE.SECRET;
      } else if (variable.valueFrom.type === 'ConfigMap') {
        varModel.type = VARIABLE_TYPE.CONFIG_MAP;
      }

      customValueFromVariables.push(varModel);
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

      variables.forEach(({ key: variableName, value }) => {
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
            value,
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

  return Object.entries(secretData || {}).map(([env, value]) => ({
    key: `${envPrefix}${env}`,
    value: value,
  }));
}
