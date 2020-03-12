import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, wait } from '@testing-library/react';
import CreateApiPackageForm from '../CreateApiPackageForm';

import { createApiPackageMock, refetchApiPackageMock } from './mocks';

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.local',
}));

jest.mock('index', () => {
  return {
    CompassGqlContext: {},
  };
});

jest.mock('react-shared', () => ({
  ...jest.requireActual('react-shared'),
  JSONEditor: () => null,
}));
describe('CreateApiPackageForm', () => {
  it('Sends request and shows notification on form submit', async () => {
    console.warn = jest.fn(); // componentWillUpdate on JSONEditorComponent

    const formRef = React.createRef();
    const completedCallback = jest.fn();

    const { getByLabelText } = render(
      <MockedProvider
        mocks={[createApiPackageMock, refetchApiPackageMock]}
        addTypename={false}
      >
        <CreateApiPackageForm
          applicationId="app-id"
          formElementRef={formRef}
          onChange={() => {}}
          onCompleted={completedCallback}
          onError={() => {}}
        />
      </MockedProvider>,
    );

    fireEvent.change(getByLabelText(/Name/), {
      target: { value: 'api-package-name' },
    });
    fireEvent.change(getByLabelText('Description'), {
      target: { value: 'api-package-description' },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(() => expect(completedCallback).toHaveBeenCalled());
  });
});
