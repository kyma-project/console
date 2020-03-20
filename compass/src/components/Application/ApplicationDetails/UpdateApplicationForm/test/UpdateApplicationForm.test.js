import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  validApplicationUpdateMock,
  invalidApplicationUpdateMock,
  applicationMock,
} from './mock';
import { render, fireEvent } from '@testing-library/react';
import UpdateApplicationForm from '../UpdateApplicationForm.container';

describe('UpdateApplicationForm UI', () => {
  //for "Warning: componentWillReceiveProps has been renamed"
  console.warn = jest.fn();

  afterEach(() => {
    console.warn.mockReset();
  });

  afterAll(() => {
    if (console.warn.mock.calls.length) {
      expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
    }
  });

  it('Renders form after load', async () => {
    const formRef = React.createRef();

    const { queryByPlaceholderText } = render(
      <MockedProvider addTypename={false} mocks={[validApplicationUpdateMock]}>
        <UpdateApplicationForm
          formElementRef={formRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );

    const providerField = queryByPlaceholderText('Provider name');
    expect(providerField).toBeInTheDocument();
    expect(providerField.value).toBe(applicationMock.providerName);

    const descriptionField = queryByPlaceholderText('Application description');
    expect(descriptionField).toBeInTheDocument();
    expect(descriptionField.value).toBe(applicationMock.description);
  });

  it('Sends request and shows notification on form submit', async () => {
    const formRef = React.createRef();
    const completedCallback = jest.fn();

    const { getByLabelText } = render(
      <MockedProvider addTypename={false} mocks={[validApplicationUpdateMock]}>
        <UpdateApplicationForm
          formElementRef={formRef}
          onChange={() => {}}
          onCompleted={completedCallback}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );

    fireEvent.change(getByLabelText('Provider Name'), {
      target: { value: 'new-provider' },
    });
    fireEvent.change(getByLabelText('Description'), {
      target: { value: 'new-desc' },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(0);

    expect(completedCallback).toHaveBeenCalled();
  });

  it('Displays error notification when mutation fails', async () => {
    const formRef = React.createRef();
    const errorCallback = jest.fn();

    const { getByLabelText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[invalidApplicationUpdateMock]}
      >
        <UpdateApplicationForm
          formElementRef={formRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={errorCallback}
          application={applicationMock}
        />
      </MockedProvider>,
    );

    fireEvent.change(getByLabelText('Provider Name'), {
      target: { value: 'new-provider' },
    });
    fireEvent.change(getByLabelText('Description'), {
      target: { value: 'new-desc' },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(0);

    expect(errorCallback).toHaveBeenCalled();
  });
});
