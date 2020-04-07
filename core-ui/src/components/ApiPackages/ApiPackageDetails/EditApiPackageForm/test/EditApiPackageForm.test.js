import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, wait } from '@testing-library/react';
import EditApiPackageForm from '../EditApiPackageForm';

import {
  apiPackageMock,
  updateApiPackageMock,
  basicCredentialsMock,
  updateApiPackageWithBasicMock,
  oAuthCredentialsMock,
  updateApiPackageWithOAuthMock,
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
    const formRef = React.createRef();

    const { queryByLabelText, getByText, queryByText } = render(
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

    fireEvent.click(getByText('Credentials'));
    expect(queryByText('None')).toBeInTheDocument();
  });

  it('Sends request and shows notification on form submit with no credentials', async () => {
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

  it('Sends request and shows notification on form submit with Basic credentials', async () => {
    console.error = jest.fn(); // Warning: `NaN` is an invalid value for the `left` css style property.

    const formRef = React.createRef();
    const completedCallback = jest.fn();

    const { getByLabelText, getByText } = render(
      <MockedProvider
        mocks={[updateApiPackageWithBasicMock, refetchApiPackageMock]}
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

    fireEvent.click(getByText('Credentials')); // select tab
    fireEvent.click(getByText('None')); // open dropdown
    fireEvent.click(getByText('Basic')); // select basic credentials

    fireEvent.change(getByLabelText(/Username/), {
      target: { value: basicCredentialsMock.username },
    });
    fireEvent.change(getByLabelText(/Password/), {
      target: { value: basicCredentialsMock.password },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(() => expect(completedCallback).toHaveBeenCalled());
  });

  it('Sends request and shows notification on form submit with OAuth credentials', async () => {
    console.error = jest.fn(); // Warning: `NaN` is an invalid value for the `left` css style property.

    const formRef = React.createRef();
    const completedCallback = jest.fn();

    const { getByLabelText, getByText } = render(
      <MockedProvider
        mocks={[updateApiPackageWithOAuthMock, refetchApiPackageMock]}
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

    fireEvent.click(getByText('Credentials')); // select tab
    fireEvent.click(getByText('None')); // open dropdown
    fireEvent.click(getByText('OAuth')); // select oAuth credentials

    fireEvent.change(getByLabelText(/Client ID/), {
      target: { value: oAuthCredentialsMock.clientId },
    });
    fireEvent.change(getByLabelText(/Client Secret/), {
      target: { value: oAuthCredentialsMock.clientSecret },
    });
    fireEvent.change(getByLabelText(/Url/), {
      target: { value: oAuthCredentialsMock.url },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(() => expect(completedCallback).toHaveBeenCalled());
  });
});
