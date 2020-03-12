import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, wait } from '@testing-library/react';
import EditApiPackageForm from '../EditApiPackageForm';

import {
  apiPackageMock,
  updateApiPackageMock,
  refetchApiPackageMock,
} from './mocks';

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

describe('EditApiPackageForm', () => {
  it('Fills the form with API Package data', async () => {
    console.warn = jest.fn(); // componentWillUpdate on JSONEditorComponent

    const formRef = React.createRef();

    const { queryByLabelText } = render(
      <MockedProvider
        mocks={[updateApiPackageMock, refetchApiPackageMock]}
        addTypename={false}
      >
        <EditApiPackageForm
          applicationId="app-id"
          apiPackage={apiPackageMock}
          formElementRef={formRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          setCustomValid={() => {}}
        />
      </MockedProvider>,
    );

    const nameField = queryByLabelText(/Name/);
    expect(nameField).toBeInTheDocument();
    expect(nameField.value).toBe(apiPackageMock.name);

    const descriptionField = queryByLabelText('Description');
    expect(descriptionField).toBeInTheDocument();
    expect(descriptionField.value).toBe(apiPackageMock.description);
  });

  it('Sends request and shows notification on form submit', async () => {
    console.warn = jest.fn(); // componentWillUpdate on JSONEditorComponent

    const formRef = React.createRef();
    const completedCallback = jest.fn();

    const { getByLabelText } = render(
      <MockedProvider
        mocks={[updateApiPackageMock, refetchApiPackageMock]}
        addTypename={false}
      >
        <EditApiPackageForm
          applicationId="app-id"
          apiPackage={apiPackageMock}
          formElementRef={formRef}
          onChange={() => {}}
          onCompleted={completedCallback}
          onError={() => {}}
          setCustomValid={() => {}}
        />
      </MockedProvider>,
    );

    fireEvent.change(getByLabelText(/Name/), {
      target: { value: 'api-package-name-2' },
    });
    fireEvent.change(getByLabelText('Description'), {
      target: { value: 'api-package-description-2' },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(() => expect(completedCallback).toHaveBeenCalled());
  });
});
