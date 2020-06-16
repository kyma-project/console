import React from 'react';
import CircleProgress from '../CircleProgress';
import { render } from '@testing-library/react';

describe('CircleProgress', () => {
  it('displays value with percent char', () => {
    const { getByText } = render(<CircleProgress value={12}></CircleProgress>);
    expect(getByText('12%')).toBeInTheDocument();
  });

  it('displays children text', () => {
    const text = 'You spin me right round, baby right round';
    const { getByText } = render(
      <CircleProgress value={12}>{text}</CircleProgress>,
    );
    expect(getByText(text)).toBeInTheDocument();
  });
});
