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

      const cancelButton = getByText(BUTTONS.CANCEL);
      expect(cancelButton).not.toBeDisabled();
      expect(cancelButton).toBeInTheDocument();
    });

    const cancelButton = getByText(BUTTONS.CANCEL);
    fireEvent.click(cancelButton);

    await wait(() => {
      editButton = getByText(editText);
      expect(editButton).not.toBeDisabled();
    });
  }, 10000);

  test.each([
    [
      'should cannot save when user type non negative min replicas',
      '#minReplicas',
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MIN_REPLICAS_NON_NEGATIVE,
    ],
    [
      'should cannot save when user type non negative max replicas',
      '#maxReplicas',
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MAX_REPLICAS_NON_NEGATIVE,
    ],
  ])('%s', async (_, inputId, errorMessage) => {
    const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const inputs = document.querySelectorAll(inputId);
    expect(inputs).toHaveLength(1);
    fireEvent.input(inputs[0], { target: { value: '-1' } });

    await wait(() => {
      expect(getByText(errorMessage)).toBeInTheDocument();
      const saveButton = getByText(saveText);
      expect(saveButton).toBeDisabled();
    });
  });

  it('should not be able to save when user types greater min replicas than max replicas', async () => {
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

  it('should return default replicas when user click Cancel button after passing custom replicas', async () => {
    const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const minReplicas = document.querySelector('#minReplicas');
    const defaultMinReplicas = minReplicas.value;
    const maxReplicas = document.querySelector('#maxReplicas');
    const defaultMaxReplicas = maxReplicas.value;

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

    const cancelButton = getByText(BUTTONS.CANCEL);
    fireEvent.click(cancelButton);

    await wait(() => {
      expect(minReplicas.value).toEqual(defaultMinReplicas);
      expect(maxReplicas.value).toEqual(defaultMaxReplicas);
    });
  });

  it('should shows errors when backend returns incorrect replicas', async () => {
    const replicasLambda = {
      ...lambdaMock,
      replicas: {
        min: 3,
        max: 2,
      },
    };
    const { getByText } = render(
      <ResourceManagement lambda={replicasLambda} />,
    );

    let editButton = getByText(editText);
    fireEvent.click(editButton);

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
    });
  });

  it('should shows errors when user types min greater than max replicas', async () => {
    const replicasLambda = {
      ...lambdaMock,
      replicas: {
        min: 1,
        max: 2,
      },
    };
    const { getByText } = render(
      <ResourceManagement lambda={replicasLambda} />,
    );

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const minReplicas = document.querySelector('#minReplicas');
    fireEvent.input(minReplicas, { target: { value: '3' } });

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
    });
  });

  test.each([
    [
      'should can save when user type good memory format for requests',
      '#requestsMemory',
      '20M',
    ],
    [
      'should can save when user type good cpu format for requests',
      '#requestsCpu',
      '50m',
    ],
    [
      'should can save when user type good memory format for limits',
      '#limitsMemory',
      '550Mi',
    ],
    [
      'should can save when user type good cpu format for limits',
      '#limitsCpu',
      '120m',
    ],
  ])('%s', async (_, inputId, value) => {
    const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const inputs = document.querySelectorAll(inputId);
    expect(inputs).toHaveLength(1);

    fireEvent.input(inputs[0], { target: { value } });

    await wait(() => {
      const saveButton = getByText(saveText);
      expect(saveButton).not.toBeDisabled();
    });
  });

  test.each([
    [
      'should cannot save when user type wrong memory format for requests',
      '#requestsMemory',
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY.DEFAULT,
    ],
    [
      'should cannot save when user type wrong cpu format for requests',
      '#requestsCpu',
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU.DEFAULT,
    ],
    [
      'should cannot save when user type wrong memory format for limits',
      '#limitsMemory',
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY.DEFAULT,
    ],
    [
      'should cannot save when user type wrong cpu format for limits',
      '#limitsCpu',
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU.DEFAULT,
    ],
  ])(
    '%s',
    async (_, inputId, errorMessage) => {
      const { getByText } = render(<ResourceManagement lambda={lambdaMock} />);

      let editButton = getByText(editText);
      fireEvent.click(editButton);

      const inputs = document.querySelectorAll(inputId);
      expect(inputs).toHaveLength(1);

      fireEvent.input(inputs[0], { target: { value: '2137epstein' } });

      await wait(() => {
        expect(getByText(errorMessage)).toBeInTheDocument();
        const saveButton = getByText(saveText);
        expect(saveButton).toBeDisabled();
      });
    },
    10000,
  );

  it('should be able to save when user clears inputs for request and limits', async () => {
    const { getByText, getAllByText } = render(
      <ResourceManagement lambda={lambdaMock} />,
    );

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

  it('should return default values for resources when user click Cancel button after passing custom resources', async () => {
    const { getByText, getAllByText } = render(
      <ResourceManagement lambda={lambdaMock} />,
    );

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const inputs = document.querySelectorAll('.resource_input');
    expect(inputs).toHaveLength(6); // 2 for replicas + 4 for resources
    const defaultResourceValues = [
      inputs[2].value,
      inputs[3].value,
      inputs[4].value,
      inputs[5].value,
    ];

    fireEvent.input(inputs[2], { target: { value: '2137epstein' } });
    fireEvent.input(inputs[3], { target: { value: '2137epstein' } });
    fireEvent.input(inputs[4], { target: { value: '2137epstein' } });
    fireEvent.input(inputs[5], { target: { value: '2137epstein' } });

    await wait(() => {
      expect(
        getAllByText(RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY.DEFAULT),
      ).toHaveLength(2);
      expect(
        getAllByText(RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU.DEFAULT),
      ).toHaveLength(2);
      const saveButton = getByText(saveText);
      expect(saveButton).toBeDisabled();
    });

    const cancelButton = getByText(BUTTONS.CANCEL);
    fireEvent.click(cancelButton);

    await wait(() => {
      expect(inputs[2].value).toEqual(defaultResourceValues[0]);
      expect(inputs[3].value).toEqual(defaultResourceValues[1]);
      expect(inputs[4].value).toEqual(defaultResourceValues[2]);
      expect(inputs[5].value).toEqual(defaultResourceValues[3]);
    });
  }, 10000);

  it('should shows errors when backend returns incorrect resources', async () => {
    const replicasLambda = {
      ...lambdaMock,
      resources: {
        requests: {
          memory: '2137epstein',
          cpu: '2137epstein',
        },
        limits: {
          memory: '2137epstein',
          cpu: '2137epstein',
        },
      },
    };
    const { getByText, getAllByText } = render(
      <ResourceManagement lambda={replicasLambda} />,
    );

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    await wait(() => {
      expect(
        getAllByText(RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY.DEFAULT),
      ).toHaveLength(2);
      expect(
        getAllByText(RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU.DEFAULT),
      ).toHaveLength(2);
    });
  });

  it('should shows errors when user types requests greater than limits memory', async () => {
    const replicasLambda = {
      ...lambdaMock,
      resources: {
        requests: {
          memory: '10Mi',
          cpu: '100m',
        },
        limits: {
          memory: '20Mi',
          cpu: '100m',
        },
      },
    };
    const { getByText } = render(
      <ResourceManagement lambda={replicasLambda} />,
    );

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const requestsMemory = document.querySelector('#requestsMemory');
    fireEvent.input(requestsMemory, { target: { value: '30Gi' } });

    await wait(() => {
      expect(
        getByText(
          RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY.REQUEST_TOO_HIGH,
        ),
      ).toBeInTheDocument();
      expect(
        getByText(
          RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY.LIMITS_TOO_LOW,
        ),
      ).toBeInTheDocument();
    });
  });

  it('should shows errors when user types requests greater than limits cpu', async () => {
    const replicasLambda = {
      ...lambdaMock,
      resources: {
        requests: {
          memory: '20Mi',
          cpu: '50m',
        },
        limits: {
          memory: '20Mi',
          cpu: '100m',
        },
      },
    };
    const { getByText } = render(
      <ResourceManagement lambda={replicasLambda} />,
    );

    let editButton = getByText(editText);
    fireEvent.click(editButton);

    const requestsCpu = document.querySelector('#requestsCpu');
    fireEvent.input(requestsCpu, { target: { value: '0.5' } });

    await wait(() => {
      expect(
        getByText(
          RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU.REQUEST_TOO_HIGH,
        ),
      ).toBeInTheDocument();
      expect(
        getByText(RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU.LIMITS_TOO_LOW),
      ).toBeInTheDocument();
    });
  });
});
