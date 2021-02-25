import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ServicesBoundModal from '../ServicesBoundModal';

describe('ServicesBoundModal', () => {
  const namespace = 'test-namespace';
  const binding = {
    metadata: { namespace },
    spec: {
      services: [
        { id: '1', displayName: 'svc-1' },
        { id: '2', displayName: 'svc-2' },
      ],
    },
  };

  it('Renders link, modal and ', () => {
    const { queryByText } = render(<ServicesBoundModal binding={binding} />);
    const link = queryByText('test-namespace');
    expect(link).toBeInTheDocument();
    fireEvent.click(link);

    expect(queryByText('svc-1')).toBeInTheDocument();
    expect(queryByText('svc-2')).toBeInTheDocument();
  });
});
