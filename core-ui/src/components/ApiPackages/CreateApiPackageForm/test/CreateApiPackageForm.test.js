import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, wait } from '@testing-library/react';
import CreateApiPackageForm from '../CreateApiPackageForm';

// mock out JSONEditor as it throws "Not Supported" error on "destroy" function
import JSONEditor from 'jsoneditor';
import {
  createApiPackageMock,
  refetchApiPackageMock,
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
});
