import { render } from '@testing-library/react';
import { CopiableText } from '../CopiableText';
import React from 'react';

jest.mock('copy-to-clipboard');
import copyToClipboard from 'copy-to-clipboard';

describe('CopiableText', () => {
  it('renders the text', () => {
    const text = 'abcd und 123456';
    const { queryByText } = render(<CopiableText text={text} />);

    expect(queryByText(text)).toBeInTheDocument();
  });

  it('copies text to clipboard whe button is clicked', () => {
    const text = 'abcd und 123456';
    const { getByRole } = render(<CopiableText text={text} />);

    getByRole('button').click();

    expect(copyToClipboard).toHaveBeenCalledWith(text);
  });
});
