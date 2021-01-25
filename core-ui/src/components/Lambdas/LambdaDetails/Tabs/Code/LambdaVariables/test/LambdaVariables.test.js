import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';
import {
  newVariableModel,
  VARIABLE_VALIDATION,
  VARIABLE_TYPE,
} from 'components/Lambdas/helpers/lambdaVariables';
import { ENVIRONMENT_VARIABLES_PANEL } from 'components/Lambdas/constants';

import LambdaVariables from '../LambdaVariables';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';

const timeout = 10000;

jest.mock('@luigi-project/client', () => {
  return {
    linkManager: () => ({
      navigate: () => {},
    }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('LambdaVariables + EditVariablesModal + EditVariablesForm', () => {
  const customVariable1 = newVariableModel({
    variable: {
      name: 'FOO',
      value: 'foo',
    },
  });
  const customVariable2 = newVariableModel({
    variable: {
      name: 'BAR',
      value: 'bar',
    },
  });
  const secretValueFromVariable = newVariableModel({
    type: VARIABLE_TYPE.SECRET,
    variable: {
      name: 'BAZ',
      value: '',
      namespace: 'default',
    },
    additionalProps: {
      resourceKey: 'test-key',
      resourceName: 'test-secret',
    },
  });
  const configMapValueFromVariable = newVariableModel({
    type: VARIABLE_TYPE.CONFIG_MAP,
    variable: {
      name: 'QAZ',
      value: '',
      namespace: 'default',
    },
    additionalProps: {
      resourceKey: 'test-key',
      resourceName: 'test-cm',
    },
  });

  const customVariables = [customVariable1, customVariable2];
  const valueFromVariables = [
    secretValueFromVariable,
    configMapValueFromVariable,
  ];
  const injectedVariables = [
    newVariableModel({
      type: VARIABLE_TYPE.BINDING_USAGE,
      variable: {
        name: 'BAR',
        value: 'SECRET',
      },
      validation: VARIABLE_VALIDATION.CAN_OVERRIDE_BY_CUSTOM_ENV,
      additionalProps: {
        serviceInstanceName: 'serviceInstanceName',
      },
    }),
  ];

  it(
    'Render with minimal props',
    async () => {
      const { getByText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={[]}
          customValueFromVariables={[]}
          injectedVariables={[]}
        />,
      );

      expect(
        getByText(ENVIRONMENT_VARIABLES_PANEL.LIST.TITLE),
      ).toBeInTheDocument();
      expect(
        getByText(ENVIRONMENT_VARIABLES_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND),
      ).toBeInTheDocument();
      await wait();
    },
    timeout,
  );

  it(
    'should render table with some data',
    async () => {
      const { container, queryByRole, queryAllByRole, getAllByText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={customVariables}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const table = queryByRole('table');
      expect(table).toBeInTheDocument();

      expect(queryAllByRole('row')).toHaveLength(4); // header + 3 element;

      const userVariables = getAllByText(
        ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.CUSTOM.TEXT,
      );
      expect(userVariables).toHaveLength(2);

      const serviceBindingVariables = getAllByText(
        ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.BINDING_USAGE.TEXT,
      );
      expect(serviceBindingVariables).toHaveLength(1);

      const rowsWithWarningText = getAllByText(
        ENVIRONMENT_VARIABLES_PANEL.WARNINGS.TEXT,
      );
      expect(rowsWithWarningText).toHaveLength(2);
    },
    timeout,
  );

  it(
    'should render table with valueFrom variables',
    async () => {
      const { container, queryByRole, queryAllByRole, getAllByText } = render(
        <MockedProvider>
          <LambdaVariables
            lambda={lambdaMock}
            customVariables={[]}
            customValueFromVariables={valueFromVariables}
            injectedVariables={[]}
          />
        </MockedProvider>,
      );

      const table = queryByRole('table');
      expect(table).toBeInTheDocument();

      expect(queryAllByRole('row')).toHaveLength(3); // header + 2 element - cm and secret;

      const secretVars = getAllByText(
        ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.SECRET.TEXT,
      );
      expect(secretVars).toHaveLength(1);

      const cmVars = getAllByText(
        ENVIRONMENT_VARIABLES_PANEL.VARIABLE_TYPE.CONFIG_MAP.TEXT,
      );
      expect(cmVars).toHaveLength(1);
    },
    timeout,
  );

  it(
    'should show modal after click action button',
    async () => {
      const { getByText, getByRole } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={[]}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const button = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT,
      );
      fireEvent.click(button);
      expect(getByRole('dialog')).toBeInTheDocument();
    },
    timeout,
  );

  it(
    'should not able to save variables if there are any custom variables',
    async () => {
      const { getByText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={[]}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const button = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT,
      );
      fireEvent.click(button);

      const editButton = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.TEXT,
      );
      expect(editButton).toBeInTheDocument();
      expect(editButton).toBeDisabled();
    },
    timeout,
  );

  it(
    'should can save variables when custom variables override injected variables',
    async () => {
      const { getByText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={customVariables}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const button = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT,
      );
      fireEvent.click(button);

      const editButton = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.TEXT,
      );
      expect(editButton).toBeInTheDocument();
      expect(editButton).not.toBeDisabled();
    },
    timeout,
  );

  it(
    'should show warnings about override injected variables in edit form',
    async () => {
      const { getByText, getAllByText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={customVariables}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const button = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT,
      );
      fireEvent.click(button);

      expect(
        getAllByText(
          ENVIRONMENT_VARIABLES_PANEL.WARNINGS.VARIABLE_CAN_OVERRIDE_SBU,
        ),
      ).toHaveLength(1);
    },
    timeout,
  );

  it(
    'should can save if user delete all custom variables - case when custom variables exist',
    async () => {
      const { getByText, getAllByLabelText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={customVariables}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const button = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT,
      );
      fireEvent.click(button);

      const trashButtons = getAllByLabelText('Delete');
      expect(trashButtons).toHaveLength(2);

      fireEvent.click(trashButtons[0]);
      fireEvent.click(trashButtons[1]);

      const editButton = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.TEXT,
      );
      expect(editButton).toBeInTheDocument();
      expect(editButton).not.toBeDisabled();
    },
    timeout,
  );

  it(
    'should not able to save when user types duplicated names',
    async () => {
      const { getByText, getAllByPlaceholderText, getAllByText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={customVariables}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const button = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT,
      );
      fireEvent.click(button);

      const inputs = getAllByPlaceholderText(
        ENVIRONMENT_VARIABLES_PANEL.PLACEHOLDERS.VARIABLE_NAME,
      );
      expect(inputs).toHaveLength(2);

      fireEvent.change(inputs[0], { target: { value: 'BAR' } });
      expect(
        getAllByText(ENVIRONMENT_VARIABLES_PANEL.ERRORS.DUPLICATED),
      ).toHaveLength(1);

      const editButton = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.TEXT,
      );
      expect(editButton).toBeInTheDocument();
      expect(editButton).toBeDisabled();
    },
    timeout,
  );

  it(
    'should not able to save when user types restricted names',
    async () => {
      const { getByText, getAllByPlaceholderText, getAllByText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={customVariables}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const button = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT,
      );
      fireEvent.click(button);

      const inputs = getAllByPlaceholderText(
        ENVIRONMENT_VARIABLES_PANEL.PLACEHOLDERS.VARIABLE_NAME,
      );
      expect(inputs).toHaveLength(2);

      fireEvent.change(inputs[0], { target: { value: 'FUNC_PORT' } });
      expect(
        getAllByText(ENVIRONMENT_VARIABLES_PANEL.ERRORS.RESTRICTED),
      ).toHaveLength(1);

      const editButton = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.TEXT,
      );
      expect(editButton).toBeInTheDocument();
      expect(editButton).toBeDisabled();
    },
    timeout,
  );

  it(
    'should not able to save when user types empty names - case with existing variable',
    async () => {
      const { getByText, getAllByPlaceholderText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={customVariables}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const button = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT,
      );
      fireEvent.click(button);

      const inputs = getAllByPlaceholderText(
        ENVIRONMENT_VARIABLES_PANEL.PLACEHOLDERS.VARIABLE_NAME,
      );
      expect(inputs).toHaveLength(2);

      fireEvent.change(inputs[0], { target: { value: '' } });

      const editButton = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.TEXT,
      );
      expect(editButton).toBeInTheDocument();
      expect(editButton).toBeDisabled();
    },
    timeout,
  );

  it(
    'should not able to save when user add new variables - without empty error message',
    async () => {
      const { getByText } = render(
        <LambdaVariables
          lambda={lambdaMock}
          customVariables={customVariables}
          customValueFromVariables={[]}
          injectedVariables={injectedVariables}
        />,
      );

      const button = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT,
      );
      fireEvent.click(button);

      const editButton = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.CONFIRM_BUTTON.TEXT,
      );
      expect(editButton).toBeInTheDocument();
      expect(editButton).not.toBeDisabled();

      const addButton = getByText(
        ENVIRONMENT_VARIABLES_PANEL.EDIT_MODAL.ADD_ENV_BUTTON.TEXT,
      );
      expect(addButton).toBeInTheDocument();

      fireEvent.click(addButton);

      expect(editButton).toBeDisabled();
    },
    timeout,
  );
});
