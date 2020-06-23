import React from 'react';
import ResourceSpecModal from '../ResourceSpecModal';
import { render, fireEvent } from '@testing-library/react';

const spec = JSON.stringify({ a: 2, b: 3 });

jest.mock('react-shared', () => ({
  ...jest.requireActual('react-shared'),
  JSONEditor: () => null, // mock out editor, as it throws "Not Supported" in jsdom
}));

describe('ResourceSpecModal', () => {
  it('Renders with minimal props', () => {
    const { queryByText, getByText } = render(
      <ResourceSpecModal spec={spec} updateResource={() => {}} name="cmf" />,
    );

    // open modal
    fireEvent.click(getByText('Edit'));

    expect(queryByText('Update cmf')).toBeInTheDocument();
  });

  it('Callbacks on apply and closes modal', () => {
    const updateResource = jest.fn();
    const { getByText, queryByText } = render(
      <ResourceSpecModal spec={spec} updateResource={updateResource} />,
    );

    // open modal
    fireEvent.click(getByText('Edit'));

    fireEvent.click(getByText('Apply'));

    expect(updateResource).toHaveBeenCalledWith(spec);

    expect(queryByText('Apply')).not.toBeInTheDocument();
  });

  it('Does not close modal when callback returns "false"', () => {
    const updateResource = jest.fn(() => false);
    const { getByText, queryByText } = render(
      <ResourceSpecModal spec={spec} updateResource={updateResource} />,
    );

    fireEvent.click(getByText('Edit'));
    fireEvent.click(getByText('Apply'));

    expect(queryByText('Apply')).toBeInTheDocument();
  });
});
