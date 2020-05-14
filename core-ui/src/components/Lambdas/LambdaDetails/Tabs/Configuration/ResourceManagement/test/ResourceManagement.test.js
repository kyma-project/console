import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';

import ResourceManagement from '../ResourceManagement';

import {
  BUTTONS,
  RESOURCES_MANAGEMENT_PANEL,
} from 'components/Lambdas/constants';

// remove it after add 'mutationobserver-shim' to jest config https://github.com/jsdom/jsdom/issues/639
const mutationObserverMock = jest.fn(function MutationObserver(callback) {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
  // Optionally add a trigger() method to manually trigger a change
  this.trigger = mockedMutationsList => {
    callback(mockedMutationsList, this);
  };
});
global.MutationObserver = mutationObserverMock;

describe('ResourceManagement', () => {
  const editText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.EDIT;
  const saveText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.SAVE;

  it('Render with minimal props', async () => {
    const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

    const panel = RESOURCES_MANAGEMENT_PANEL;
    const array = [
      panel.TITLE,
      panel.REPLICAS.MIN_NUMBER.TITLE,
      panel.REPLICAS.MIN_NUMBER.DESCRIPTION,
      panel.REPLICAS.MAX_NUMBER.TITLE,
      panel.REPLICAS.MAX_NUMBER.DESCRIPTION,
      panel.RESOURCES.REQUESTS.TITLE,
      panel.RESOURCES.REQUESTS.DESCRIPTION,
      panel.RESOURCES.LIMITS.TITLE,
      panel.RESOURCES.LIMITS.DESCRIPTION,
    ];
    for (const item of array) {
      expect(getByText(item)).toBeInTheDocument();
    }
  });

  it('show Save and Cancel buttons after click Edit button', async () => {
    const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

    const editButton = getByText(editText);
    expect(editButton).toBeInTheDocument();
    expect(editButton).not.toBeDisabled();
    fireEvent.click(editButton);

    await wait(() => {
      const saveButton = getByText(saveText);
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toBeInTheDocument();
      const cancelButton = getByText(BUTTONS.CANCEL);
      expect(cancelButton).not.toBeDisabled();
      expect(cancelButton).toBeInTheDocument();
    });
  });

  it('show again Edit button after click Cancel', async () => {
    const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    await wait(() => {
      const saveButton = getByText(saveText);
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toBeInTheDocument();

      cancelButton = getByText(BUTTONS.CANCEL);
      expect(cancelButton).not.toBeDisabled();
      expect(cancelButton).toBeInTheDocument();
      fireEvent.click(cancelButton);

      editButton = getByText(editText);
      expect(editButton).not.toBeDisabled();
    });
  });

  const replicasTestCases = [
    {
      name: 'should cannot save when user type non negative min replicas',
      id: '#minReplicas',
      errorMessage:
        RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MIN_REPLICAS_NON_NEGATIVE,
    },
    {
      name: 'should cannot save when user type non negative max replicas',
      id: '#maxReplicas',
      errorMessage:
        RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MAX_REPLICAS_NON_NEGATIVE,
    },
  ];
  for (const testCase of replicasTestCases) {
    it(testCase.name, async () => {
      const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

      let editButton = getByText(editText);
      fireEvent.click(editButton);

      const inputs = document.querySelectorAll(testCase.id);
      expect(inputs).toHaveLength(1);
      fireEvent.input(inputs[0], { target: { value: '-1' } });

      await wait(() => {
        expect(getByText(testCase.errorMessage)).toBeInTheDocument();
        const saveButton = getByText(saveText);
        expect(saveButton).toBeDisabled();
      });
    });
  }

  it('should cannot save when user type greater min replicas than max replicas', async () => {
    const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const minReplicas = document.querySelector('#minReplicas');
    const maxReplicas = document.querySelector('#maxReplicas');

    fireEvent.input(minReplicas, { target: { value: '3' } });
    fireEvent.input(maxReplicas, { target: { value: '2' } });

    await wait(() => {
      expect(
        getByText(
          RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MIN_REPLICAS_TOO_HIGH,
        ),
      ).toBeInTheDocument();
      expect(
        getByText(
          RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MAX_REPLICAS_TOO_LOW,
        ),
      ).toBeInTheDocument();
      const saveButton = getByText(saveText);
      expect(saveButton).toBeDisabled();
    });
  });

  it('should can save when user type 0 for min and max replicas', async () => {
    const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const minReplicas = document.querySelector('#minReplicas');
    const maxReplicas = document.querySelector('#maxReplicas');

    fireEvent.input(minReplicas, { target: { value: '0' } });
    fireEvent.input(maxReplicas, { target: { value: '0' } });

    await wait(() => {
      const saveButton = getByText(saveText);
      expect(saveButton).not.toBeDisabled();
    });
  });

  const passResourcesTestCases = [
    {
      name: 'should can save when user type good memory format for requests',
      id: '#requestsMemory',
      value: '128Mi',
    },
    {
      name: 'should can save when user type wrong cpu format for requests',
      id: '#requestsCpu',
      value: '50m',
    },
    {
      name: 'should can save when user type wrong memory format for limits',
      id: '#limitsMemory',
      value: '128Mi',
    },
    {
      name: 'should can save when user type wrong cpu format for limits',
      id: '#limitsCpu',
      value: '50m',
    },
  ];
  for (const testCase of passResourcesTestCases) {
    it(testCase.name, async () => {
      const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

      let editButton = getByText(editText);
      fireEvent.click(editButton);

      const inputs = document.querySelectorAll(testCase.id);
      expect(inputs).toHaveLength(1);

      fireEvent.input(inputs[0], { target: { value: testCase.value } });

      await wait(() => {
        const saveButton = getByText(saveText);
        expect(saveButton).not.toBeDisabled();
      });
    });
  }

  const failResourcesTestCases = [
    {
      name:
        'should cannot save when user type wrong memory format for requests',
      id: '#requestsMemory',
      errorMessage: RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY,
    },
    {
      name: 'should cannot save when user type wrong cpu format for requests',
      id: '#requestsCpu',
      errorMessage: RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU,
    },
    {
      name: 'should cannot save when user type wrong memory format for limits',
      id: '#limitsMemory',
      errorMessage: RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY,
    },
    {
      name: 'should cannot save when user type wrong cpu format for limits',
      id: '#limitsCpu',
      errorMessage: RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU,
    },
  ];
  for (const testCase of failResourcesTestCases) {
    it(testCase.name, async () => {
      const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

      let editButton = getByText(editText);
      fireEvent.click(editButton);

      const inputs = document.querySelectorAll(testCase.id);
      expect(inputs).toHaveLength(1);

      fireEvent.input(inputs[0], { target: { value: '2137epstein' } });

      await wait(() => {
        expect(getByText(testCase.errorMessage)).toBeInTheDocument();
        const saveButton = getByText(saveText);
        expect(saveButton).toBeDisabled();
      });
    });
  }

  it('should can save when user clear inputs for request and limits', async () => {
    const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const inputs = document.querySelectorAll('.resource_input');
    expect(inputs).toHaveLength(6); // 2 for replicas + 4 for resources

    fireEvent.input(inputs[2], { target: { value: '' } });
    fireEvent.input(inputs[3], { target: { value: '' } });
    fireEvent.input(inputs[4], { target: { value: '' } });
    fireEvent.input(inputs[5], { target: { value: '' } });

    await wait(() => {
      const saveButton = getByText(saveText);
      expect(saveButton).not.toBeDisabled();
    });
  });
});
