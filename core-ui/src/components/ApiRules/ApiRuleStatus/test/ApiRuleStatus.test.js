import React from 'react';
import { render } from '@testing-library/react';

import ApiRuleStatus from '../ApiRuleStatus';

describe('ApiRuleStatus', () => {
  it('Renders with minimal props', () => {
    const apiRule = {
      status: {
        apiRuleStatus: {
          code: 'OK',
          desc: '',
        },
      },
    };
    const { queryByRole } = render(<ApiRuleStatus apiRule={apiRule} />);

    const statusText = queryByRole('status');
    expect(statusText).toBeInTheDocument();
    expect(statusText).toHaveTextContent('OK');
  });
});
