import React from 'react';
import {
  fireEvent,
  render,
  waitForDomChange,
  wait,
} from '@testing-library/react';
import DeployResourceModal from '../DeployResourceModal';
import * as helpers from '../deployResourceHelpers';
import { namespace, successRequestMock, failureRequestMock } from './mocks';
import { MockedProvider } from '@apollo/react-testing';

const mockNotifySuccess = jest.fn();
const mockNotifyError = jest.fn();
jest.mock('react-shared', () => ({
  ...jest.requireActual('react-shared'),
  useNotification: () => ({
    notifySuccess: mockNotifySuccess,
    notifyError: mockNotifyError,
  }),
}));

describe('DeployResourceModal', () => {
  afterEach(() => {
    mockNotifySuccess.mockReset();
    mockNotifyError.mockReset();
  });

  it('displays message when choosen file is invalid', async () => {
    helpers.parseFile = () => [null, 'some error here'];

    const { getByText, getByLabelText, queryByRole } = render(
      <DeployResourceModal namespace={namespace} />,
    );

    // open modal
    fireEvent.click(getByText('Deploy new resource'));

    // set file
    fireEvent.change(getByLabelText(/Browse/), { target: { files: [{}] } });

    await waitForDomChange();

    const errorMessage = queryByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('some error here');

    expect(getByText('Deploy')).toBeDisabled();
  });

  it('accepts valid file and sends out requests on "Confirm" - all valid responses', async () => {
    helpers.parseFile = () => [[{ kind: 'test', metadata: {} }], ''];

    const { getByText, getByLabelText, queryByRole } = render(
      <MockedProvider addTypename={false} mocks={[successRequestMock]}>
        <DeployResourceModal namespace={namespace} />
      </MockedProvider>,
    );

    // open modal
    fireEvent.click(getByText('Deploy new resource'));

    // set file
    fireEvent.change(getByLabelText(/Browse/), { target: { files: [{}] } });

    await waitForDomChange();

    const errorMessage = queryByRole('alert');
    expect(errorMessage).not.toBeInTheDocument();

    const submitButton = getByText('Deploy');
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    await wait(() => {
      expect(successRequestMock.result).toHaveBeenCalled();
      expect(mockNotifySuccess).toHaveBeenCalled();
    });
  }, 20000);

  it('accepts valid file and sends out requests on "Confirm" - invalid response', async () => {
    helpers.parseFile = () => [
      [
        { kind: 'test', metadata: {} },
        { kind: 'test2', metadata: {} },
      ],
      '',
    ];

    const { getByText, getByLabelText } = render(
      <MockedProvider
        addTypename={false}
        mocks={[successRequestMock, failureRequestMock]}
      >
        <DeployResourceModal namespace={namespace} />
      </MockedProvider>,
    );

    // open modal
    fireEvent.click(getByText('Deploy new resource'));

    // set file
    fireEvent.change(getByLabelText(/Browse/), { target: { files: [{}] } });

    await waitForDomChange();

    fireEvent.click(getByText('Deploy'));

    await wait(() => {
      expect(successRequestMock.result).toHaveBeenCalled();
      expect(mockNotifyError).toHaveBeenCalled();
    });
  }, 20000);
});
