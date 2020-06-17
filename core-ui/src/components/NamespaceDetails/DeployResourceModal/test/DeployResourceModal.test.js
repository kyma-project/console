import React from 'react';
import {
  fireEvent,
  render,
  waitForDomChange,
  wait,
} from '@testing-library/react';
import DeployResourceModal from '../DeployResourceModal';
import { ConfigContext } from 'react-shared';
import * as helpers from '../deployResourceHelpers';

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
      <DeployResourceModal name="ns" />,
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
    helpers.parseFile = () => [[{ kind: 'test' }], ''];
    helpers.getResourceUrl = () => 'sample-url';
    const fetchMock = jest.fn().mockImplementation(() => ({ ok: true }));
    global.fetch = fetchMock;

    const { getByText, getByLabelText, queryByRole } = render(
      <ConfigContext.Provider value={{ fromConfig: () => '' }}>
        <DeployResourceModal name="ns" />
      </ConfigContext.Provider>,
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
      expect(fetchMock).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenLastCalledWith(
        'sample-url',
        expect.anything(),
      );
      expect(mockNotifySuccess).toHaveBeenCalled();
    });
  }, 20000);

  it('accepts valid file and sends out requests on "Confirm" - invalid response', async () => {
    helpers.parseFile = () => [[{ kind: 'test' }, { kind: 'test2' }], ''];
    helpers.getResourceUrl = () => 'sample-url';
    const fetchMock = jest
      .fn()
      .mockImplementationOnce(() => ({ ok: true }))
      .mockImplementationOnce(() => ({ ok: false }));
    global.fetch = fetchMock;

    const { getByText, getByLabelText } = render(
      <ConfigContext.Provider value={{ fromConfig: () => '' }}>
        <DeployResourceModal name="ns" />
      </ConfigContext.Provider>,
    );

    // open modal
    fireEvent.click(getByText('Deploy new resource'));

    // set file
    fireEvent.change(getByLabelText(/Browse/), { target: { files: [{}] } });

    await waitForDomChange();

    fireEvent.click(getByText('Deploy'));

    await wait(() => expect(mockNotifyError).toHaveBeenCalled());
  }, 20000);
});
