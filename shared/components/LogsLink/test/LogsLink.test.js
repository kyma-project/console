import React from 'react';
import { LogsLink } from '../LogsLink';
import { render } from '@testing-library/react';

describe('LogsLink', () => {
  it('Labels should render with labels', () => {
    const query = `{namespace="default"}`;
    const domain = 'kyma.cluster.com';
    const expectedHref =
      'https://grafana.kyma.cluster.com/explore?left=[%22now-1h%22,%22now%22,%22Loki%22,{%22expr%22:%22{namespace=\\%22default\\%22}%22},{%22mode%22:%22Logs%22},{%22ui%22:[true,true,true,%22none%22]}]';
    const { queryByText } = render(<LogsLink domain={domain} query={query} />);

    expect(queryByText('Logs')).toHaveProperty('href', expectedHref);
  });
});
