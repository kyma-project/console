import { lambdaMock, serviceBindingUsageMock } from '../../testing/mockData';
import {
  serializeVariables,
  retrieveVariablesFromBindingUsage,
} from '../serializeVariables';
import { VARIABLE_TYPE, VARIABLE_VALIDATION } from '../constants';

describe('retrieveVariablesFromBindingUsage', () => {
  test('should correct retrieve variables from bindingUsage', () => {
    const envs = retrieveVariablesFromBindingUsage(serviceBindingUsageMock);
    const expectedEnvs = ['PREFIX_FOO', 'PREFIX_BAR'];

    expect(envs).toEqual(expectedEnvs);
  });
});

describe('serializeVariables', () => {
  test('should return serialized arrays', () => {
    const lambdaVariables = lambdaMock.env;
    const bindingUsages = [serviceBindingUsageMock];

    const {
      customVariables,
      customValueFromVariables,
      injectedVariables,
    } = serializeVariables({
      lambdaVariables,
      bindingUsages,
    });

    const expectedCustomVariable = {
      type: VARIABLE_TYPE.CUSTOM,
      name: 'FOO',
      value: 'bar',
      validation: VARIABLE_VALIDATION.NONE,
      dirty: true,
    };
    const customVariable = customVariables[0];
    delete customVariable.id;
    expect(customVariable).toEqual(expectedCustomVariable);

    const expectedCustomValueFromVariable = {
      name: 'PICO',
      valueFrom: {
        type: 'Secret',
        name: 'secret',
        key: 'KEY',
        optional: false,
      },
    };
    expect(customValueFromVariables[0]).toEqual(
      expectedCustomValueFromVariable,
    );

    const expectedInjectedVariables = [
      {
        type: VARIABLE_TYPE.BINDING_USAGE,
        name: 'PREFIX_FOO',
        value: '',
        validation: VARIABLE_VALIDATION.NONE,
        serviceInstanceName: 'serviceInstanceName',
      },
      {
        type: VARIABLE_TYPE.BINDING_USAGE,
        name: 'PREFIX_BAR',
        value: '',
        validation: VARIABLE_VALIDATION.NONE,
        serviceInstanceName: 'serviceInstanceName',
      },
    ];
    delete injectedVariables[0].id;
    delete injectedVariables[1].id;
    expect(injectedVariables).toEqual(expectedInjectedVariables);
  });
});
