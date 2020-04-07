import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, wait } from '@testing-library/react';
import EditApiPackageForm from '../EditApiPackageForm';

// mock out JSONEditor as it throws "Not Supported" error on "destroy" function
import JSONEditor from 'jsoneditor';
import {
  apiPackageMock,
  updateApiPackageMock,
  oAuthDataMock,
  oAuthDataNewMock,
  apiPackageWithOAuthMock,
  updateApiPackageWithOAuthMock,
  basicDataMock,
  basicDataNewMock,
  apiPackageWithBasicMock,
  updateApiPackageWithBasicMock,
  refetchApiPackageMock,
  jsonEditorMock,
} from './mocks';

jest.mock('jsoneditor', () => jest.fn()); // mock constructor separately
JSONEditor.mockImplementation(() => jsonEditorMock);

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

  it('Sends request and shows notification on form submit with oauth', async () => {
    console.warn = jest.fn(); // componentWillUpdate on JSONEditorComponent

    const formRef = React.createRef();
    const completedCallback = jest.fn();

    const { getByLabelText } = render(
      <MockedProvider
        mocks={[updateApiPackageWithOAuthMock, refetchApiPackageMock]}
        addTypename={false}
      >
        <EditApiPackageForm
          applicationId="app-id"
          apiPackage={apiPackageWithOAuthMock}
          formElementRef={formRef}
          onChange={() => {}}
          onCompleted={completedCallback}
          onError={() => {}}
          setCustomValid={() => {}}
        />
      </MockedProvider>,
    );

    expect(getByLabelText(/Client ID/).value).toBe(oAuthDataMock.clientId);
    expect(getByLabelText(/Client Secret/).value).toBe(
      oAuthDataMock.clientSecret,
    );
    expect(getByLabelText(/Url/).value).toBe(oAuthDataMock.url);

    fireEvent.change(getByLabelText(/Client ID/), {
      target: { value: oAuthDataNewMock.clientId },
    });
    fireEvent.change(getByLabelText(/Client Secret/), {
      target: { value: oAuthDataNewMock.clientSecret },
    });
    fireEvent.change(getByLabelText(/Url/), {
      target: { value: oAuthDataNewMock.url },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(() => expect(completedCallback).toHaveBeenCalled());
  });

  it('Sends request and shows notification on form submit with basic', async () => {
    console.warn = jest.fn(); // componentWillUpdate on JSONEditorComponent

    const formRef = React.createRef();
    const completedCallback = jest.fn();

    const { getByLabelText } = render(
      <MockedProvider
        mocks={[updateApiPackageWithBasicMock, refetchApiPackageMock]}
        addTypename={false}
      >
        <EditApiPackageForm
          applicationId="app-id"
          apiPackage={apiPackageWithBasicMock}
          formElementRef={formRef}
          onChange={() => {}}
          onCompleted={completedCallback}
          onError={() => {}}
          setCustomValid={() => {}}
        />
      </MockedProvider>,
    );

    expect(getByLabelText(/Username/).value).toBe(basicDataMock.username);
    expect(getByLabelText(/Password/).value).toBe(basicDataMock.password);

    fireEvent.change(getByLabelText(/Username/), {
      target: { value: basicDataNewMock.username },
    });
    fireEvent.change(getByLabelText(/Password/), {
      target: { value: basicDataNewMock.password },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(() => expect(completedCallback).toHaveBeenCalled());
  });
});
