import React from 'react';
import { render } from '@testing-library/react';
import ApiRuleStatus from '../ApiRuleStatus';

describe('ApiRuleStatus', () => {
  it('Renders with minimal props', () => {
    const { queryByRole } = render(<ApiRuleStatus code="OK" />);

    const statusText = queryByRole('status');
    expect(statusText).toBeInTheDocument();
    expect(statusText).toHaveTextContent('OK');
  });
});
