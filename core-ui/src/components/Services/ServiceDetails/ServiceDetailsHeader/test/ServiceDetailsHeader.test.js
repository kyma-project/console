import React from 'react';
import { render } from '@testing-library/react';
import ServiceDetailsHeader from '../ServiceDetailsHeader';

const service = {
  name: 'service-name',
  labels: { a: 'b', c: 'd' },
  clusterIP: 'remotehost',
  json: {},
};

const namespaceId = 'namespace-id';

describe('ServiceDetailsHeadeqr', () => {
  it('Renders with minimal props', () => {
    const { queryByText } = render(
      <ServiceDetailsHeader service={service} namespaceId={namespaceId} />,
    );

    expect(queryByText(service.name)).toBeInTheDocument();
    expect(queryByText('a=b')).toBeInTheDocument();
    expect(queryByText('c=d')).toBeInTheDocument();
    expect(queryByText('remotehost')).toBeInTheDocument();
  });
});
