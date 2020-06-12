import React from 'react';
import { fireEvent, render, waitForDomChange } from '@testing-library/react';
import DeployResourceModal from '../DeployResourceModal';
import { ConfigContext } from 'react-shared';
import * as helpers from '../deployResourceHelpers';

describe('DeployResourceModal', () => {
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

  it('accepts valid file and sends out request on "Confirm"', async () => {
    helpers.parseFile = () => [{ kind: 'test' }, ''];
    helpers.getResourceUrl = () => 'sample-url';
    const fetchMock = jest.fn();
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

    expect(fetchMock).toHaveBeenCalledWith('sample-url', expect.anything());
  }, 20000);
});
