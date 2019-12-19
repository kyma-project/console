import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  validApplicationsQueryMock,
  invalidApplicationsQueryMock,
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
  const emptyRef = { current: null };

  it('Displays "loading" when there is no gql response', async () => {
    const { container } = render(
      <MockedProvider addTypename={false}>
        <UpdateApplicationForm
          formElementRef={emptyRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );
    expect(container.textContent).toBe('Loading...');
    await wait(0); // just to shut up the infamous act() warning
  });

  it('Displays error in error state', async () => {
    const { container } = render(
      <MockedProvider
        addTypename={false}
        mocks={[invalidApplicationsQueryMock]}
      >
        <UpdateApplicationForm
          formElementRef={emptyRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );
    expect(container.textContent).toBe('Loading...');

    await wait(0); // wait for response

    expect(container.textContent).toBe('Error! Network error: Query error');
  });

  it('Renders form after load', async () => {
    const { queryByPlaceholderText } = render(
      <MockedProvider addTypename={false} mocks={[validApplicationsQueryMock]}>
        <UpdateApplicationForm
          formElementRef={emptyRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );

    await wait(0); // wait for response

    expect(queryByPlaceholderText('Application name')).toBeInTheDocument();
    expect(
      queryByPlaceholderText('Application description'),
    ).toBeInTheDocument();
  });

  it('Displays validation messages', async () => {
    const { queryByPlaceholderText } = render(
      <MockedProvider addTypename={false} mocks={[validApplicationsQueryMock]}>
        <UpdateApplicationForm
          formElementRef={emptyRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );

    await wait(0); // wait for response

    const nameInput = queryByPlaceholderText('Application name');

    // initial state
    expect(nameInput.validationMessage).toBeFalsy();

    // duplicate app name
    fireEvent.change(nameInput, {
      target: {
        value: 'app2',
      },
    });

    expect(nameInput.validationMessage).toEqual(
      'Application with this name already exists.',
    );

    // empty

    fireEvent.change(nameInput, {
      target: {
        value: '',
      },
    });

    expect(nameInput.validationMessage).toEqual('Constraints not satisfied');

    // valid name
    fireEvent.change(nameInput, {
      target: {
        value: 'app3',
      },
    });
    expect(nameInput.validationMessage).toBeFalsy();
  });
});
