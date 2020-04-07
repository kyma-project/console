import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, wait } from '@testing-library/react';
import CreateApiPackageForm from '../CreateApiPackageForm';

// mock out JSONEditor as it throws "Not Supported" error on "destroy" function
import JSONEditor from 'jsoneditor';
import {
  createApiPackageMock,
  createApiPackageWithOAuthMock,
  oAuthDataMock,
  refetchApiPackageMock,
  basicDataMock,
  createApiPackageWithBasicMock,
  jsonEditorMock,
} from './mocks';

jest.mock('jsoneditor', () => jest.fn()); // mock constructor separately
JSONEditor.mockImplementation(() => jsonEditorMock);

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
  it('Sends request and shows notification on form submit with oauth', async () => {
    console.warn = jest.fn(); // componentWillUpdate on JSONEditorComponent

    const formRef = React.createRef();
    const completedCallback = jest.fn();

    const { getByLabelText, getByText } = render(
      <MockedProvider
        mocks={[createApiPackageWithOAuthMock, refetchApiPackageMock]}
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

    //change auth to oAuth
    fireEvent.click(getByText('None'));
    fireEvent.click(getByText('OAuth'));
    fireEvent.change(getByLabelText(/Client ID/), {
      target: { value: oAuthDataMock.clientId },
    });
    fireEvent.change(getByLabelText(/Client Secret/), {
      target: { value: oAuthDataMock.clientSecret },
    });
    fireEvent.change(getByLabelText(/Url/), {
      target: { value: oAuthDataMock.url },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(() => expect(completedCallback).toHaveBeenCalled());
  });

  it('Sends request and shows notification on form submit with basic', async () => {
    console.warn = jest.fn(); // componentWillUpdate on JSONEditorComponent

    const formRef = React.createRef();
    const completedCallback = jest.fn();

    const { getByLabelText, getByText } = render(
      <MockedProvider
        mocks={[createApiPackageWithBasicMock, refetchApiPackageMock]}
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

    //change auth to basic
    fireEvent.click(getByText('None'));
    fireEvent.click(getByText('Basic'));
    fireEvent.change(getByLabelText(/Username/), {
      target: { value: basicDataMock.username },
    });
    fireEvent.change(getByLabelText(/Password/), {
      target: { value: basicDataMock.password },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(() => expect(completedCallback).toHaveBeenCalled());
  });
});
