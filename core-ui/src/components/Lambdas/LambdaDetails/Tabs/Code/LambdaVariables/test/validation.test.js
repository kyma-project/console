import {
  validateVariables,
  validateVariable,
  getValidationStatus,
} from '../validation';
import {
  VARIABLE_VALIDATION,
  VARIABLE_TYPE,
} from 'components/Lambdas/helpers/lambdaVariables';

describe('validateVariables', () => {
  test('should return validated array', () => {
    const customVariables = [
      {
        id: 'variable',
        name: 'variable',
        validation: VARIABLE_VALIDATION.NONE,
      },
      {
        id: 'variable1',
        name: 'variable',
        validation: VARIABLE_VALIDATION.NONE,
      },
      {
        id: 'variable2',
        name: 'variable2',
        validation: VARIABLE_VALIDATION.NONE,
      },
      {
        id: 'variable3',
        name: 'variable3',
        validation: VARIABLE_VALIDATION.NONE,
      },
    ];
    const injectedVariables = [
      {
        name: 'variable2',
        type: VARIABLE_TYPE.BINDING_USAGE,
        validation: VARIABLE_VALIDATION.NONE,
      },
    ];

    const expectedVariables = [
      {
        id: 'variable',
        name: 'variable',
        validation: VARIABLE_VALIDATION.DUPLICATED,
      },
      {
        id: 'variable1',
        name: 'variable',
        validation: VARIABLE_VALIDATION.DUPLICATED,
      },
      {
        id: 'variable2',
        name: 'variable2',
        validation: VARIABLE_VALIDATION.CAN_OVERRIDE_SBU,
      },
      {
        id: 'variable3',
        name: 'variable3',
        validation: VARIABLE_VALIDATION.NONE,
      },
    ];

    expect(validateVariables(customVariables, injectedVariables)).toEqual(
      expectedVariables,
    );
  });
});

describe('validateVariable', () => {
  test('should return true if everything is ok', () => {
    const variables = [
      {
        name: 'variable',
        validation: VARIABLE_VALIDATION.NONE,
      },
      {
        name: 'variable1',
        validation: VARIABLE_VALIDATION.NONE,
      },
      {
        name: 'variable2',
        validation: VARIABLE_VALIDATION.NONE,
      },
    ];
    const currentVariable = {
      name: 'variable',
      validation: VARIABLE_VALIDATION.NONE,
    };

    expect(validateVariable(variables, currentVariable)).toBeTruthy();
  });

  test('should return false if currentVariable name is empty', () => {
    const variables = [];
    const currentVariable = {
      name: '',
      validation: VARIABLE_VALIDATION.NONE,
    };

    expect(validateVariable(variables, currentVariable)).toBeFalsy();
  });

  test('should return false if currentVariable is duplicated, invalid or empty', () => {
    const variables = [];

    let currentVariable = {
      name: 'variable',
      validation: VARIABLE_VALIDATION.DUPLICATED,
    };
    expect(validateVariable(variables, currentVariable)).toBeFalsy();

    currentVariable = {
      name: 'variable',
      validation: VARIABLE_VALIDATION.INVALID,
    };
    expect(validateVariable(variables, currentVariable)).toBeFalsy();

    currentVariable = {
      name: 'variable',
      validation: VARIABLE_VALIDATION.EMPTY,
    };
    expect(validateVariable(variables, currentVariable)).toBeFalsy();
  });

  test('should return false if some variable is empty (not current)', () => {
    const variables = [
      {
        id: 'variable',
        name: '',
        validation: VARIABLE_VALIDATION.NONE,
      },
      {
        id: 'variable1',
        name: '',
        validation: VARIABLE_VALIDATION.NONE,
      },
      {
        id: 'variable2',
        name: 'variable2',
        validation: VARIABLE_VALIDATION.NONE,
      },
    ];
    const currentVariable = {
      name: 'variable',
      validation: VARIABLE_VALIDATION.NONE,
    };

    expect(validateVariable(variables, currentVariable)).toBeFalsy();
  });

  test('should return false if some variable has error status (not current)', () => {
    const variables = [
      {
        id: 'variable',
        name: 'variable',
        validation: VARIABLE_VALIDATION.DUPLICATED,
      },
      {
        id: 'variable1',
        name: 'variable1',
        validation: VARIABLE_VALIDATION.DUPLICATED,
      },
      {
        id: 'variable2',
        name: 'variable2',
        validation: VARIABLE_VALIDATION.NONE,
      },
    ];
    const currentVariable = {
      name: 'variable',
      validation: VARIABLE_VALIDATION.NONE,
    };

    expect(validateVariable(variables, currentVariable)).toBeFalsy();
  });
});

describe('getValidationStatus', () => {
  test('should return NONE status', () => {
    // Not dirty
    let args = {
      varName: '',
      varDirty: false,
    };
    expect(getValidationStatus(args)).toEqual(VARIABLE_VALIDATION.NONE);

    // Dirty
    args = {
      varName: 'variable',
      varDirty: true,
    };
    expect(getValidationStatus(args)).toEqual(VARIABLE_VALIDATION.NONE);

    // Not duplicated
    let userVariables = [
      {
        id: 'variable',
        name: 'variable',
      },
      {
        id: 'variable1',
        name: 'variable1',
      },
    ];
    args = {
      userVariables,
      varID: 'variable',
      varName: 'variable',
      varDirty: true,
    };
    expect(getValidationStatus(args)).toEqual(VARIABLE_VALIDATION.NONE);

    // Not duplicated with injected
    let injectedVariables = [
      {
        id: 'variable1',
        name: 'variable1',
        type: VARIABLE_TYPE.BINDING_USAGE,
      },
    ];
    args = {
      injectedVariables,
      varID: 'variable',
      varName: 'variable',
      varDirty: true,
    };
    expect(getValidationStatus(args)).toEqual(VARIABLE_VALIDATION.NONE);
  });

  test('should return EMPTY status', () => {
    const args = {
      varName: '',
      varDirty: true,
    };
    expect(getValidationStatus(args)).toEqual(VARIABLE_VALIDATION.EMPTY);
  });

  test('should return INVALID status', () => {
    let args = {
      varName: '_VARIABLE',
      varDirty: true,
    };
    expect(getValidationStatus(args)).toEqual(VARIABLE_VALIDATION.INVALID);

    args = {
      varName: '0_VARIABLE',
      varDirty: true,
    };
    expect(getValidationStatus(args)).toEqual(VARIABLE_VALIDATION.INVALID);

    args = {
      varName: 'VAR-IABLE',
      varDirty: true,
    };
    expect(getValidationStatus(args)).toEqual(VARIABLE_VALIDATION.INVALID);
  });

  test('should return DUPLICATED status', () => {
    const userVariables = [
      {
        id: 'variable',
        name: 'variable',
      },
      {
        id: 'variable1',
        name: 'variable',
      },
    ];
    const args = {
      userVariables,
      varID: 'variable',
      varName: 'variable',
      varDirty: true,
    };
    expect(getValidationStatus(args)).toEqual(VARIABLE_VALIDATION.DUPLICATED);
  });

  test('should return DUPLICATED status', () => {
    const injectedVariables = [
      {
        id: 'variable1',
        name: 'variable',
        type: VARIABLE_TYPE.BINDING_USAGE,
      },
    ];
    const args = {
      injectedVariables,
      varID: 'variable',
      varName: 'variable',
      varDirty: true,
    };
    expect(getValidationStatus(args)).toEqual(
      VARIABLE_VALIDATION.CAN_OVERRIDE_SBU,
    );
  });
});
