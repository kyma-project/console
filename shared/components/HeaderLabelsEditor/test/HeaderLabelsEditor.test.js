import React from 'react';
import { HeaderLabelsEditor } from '../HeaderLabelsEditor';
import { render, fireEvent } from '@testing-library/react';

describe('HeaderLabelsEditor', () => {
  const labels = { a: 'b', c: 'd' };

  it('Switches between readonly and edit mode', () => {
    const { queryByText, queryByLabelText, getByLabelText } = render(
      <HeaderLabelsEditor labels={labels} onApply={() => {}} />,
    );

    // readonly state
    expect(queryByLabelText('Apply')).not.toBeInTheDocument();
    expect(queryByText('a=b')).toBeInTheDocument();
    expect(queryByText('c=d')).toBeInTheDocument();

    // editor state
    fireEvent.click(queryByLabelText('Edit labels'));
    expect(queryByLabelText('Apply')).toBeInTheDocument();
    expect(queryByText('a=b')).toBeInTheDocument();
    expect(queryByText('c=d')).toBeInTheDocument();

    // back to readonly state
    fireEvent.click(getByLabelText('Cancel'));
    expect(queryByLabelText('Apply')).not.toBeInTheDocument();
  });

  it('Allows for editing labels, resets on "Cancel"', () => {
    const {
      getByText,
      getByLabelText,
      queryByText,
      getByPlaceholderText,
    } = render(<HeaderLabelsEditor labels={labels} onApply={() => {}} />);

    // switch to editor state
    fireEvent.click(getByLabelText('Edit labels'));

    // remove label
    fireEvent.click(getByText('c=d'));

    // add label
    const input = getByPlaceholderText('Enter label key=value');
    fireEvent.change(input, { target: { value: 'e=f' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(queryByText('a=b')).toBeInTheDocument();
    expect(queryByText('c=d')).not.toBeInTheDocument();
    expect(queryByText('e=f')).toBeInTheDocument();

    // switch to readonly state
    fireEvent.click(getByLabelText('Cancel'));

    expect(queryByText('a=b')).toBeInTheDocument();
    expect(queryByText('c=d')).toBeInTheDocument();
    expect(queryByText('e=f')).not.toBeInTheDocument();
  });

  it('Fires callback on "Apply"', () => {
    const onApply = jest.fn();
    const { getByText, getByLabelText } = render(
      <HeaderLabelsEditor labels={labels} onApply={onApply} />,
    );

    // switch to editor state
    fireEvent.click(getByLabelText('Edit labels'));

    // remove label
    fireEvent.click(getByText('c=d'));

    fireEvent.click(getByLabelText('Apply'));

    expect(onApply).toHaveBeenCalledWith({ a: 'b' });
  });
});
