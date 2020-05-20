import React from 'react';
import MetadataTable from '../MetadataTable';
import { render } from '@testing-library/react';

describe('MetadataTable', () => {
  it('Renders empty table', async () => {
    const { queryByText } = render(<MetadataTable ownerType="Entity" />);
    expect(queryByText(/This Entity doesn't/)).toBeInTheDocument();
  });

  it('Renders labels', async () => {
    const { queryByText } = render(
      <MetadataTable ownerType="Parent" labels={{ label1: 'value1' }} />,
    );
    expect(queryByText('label1')).toBeInTheDocument();
    expect(queryByText('value1')).toBeInTheDocument();
  });

  it('Does not render ignored labels', async () => {
    const { queryByText } = render(
      <MetadataTable
        ownerType="Ennio"
        labels={{ GOOD: 5, BAD: 6 }}
        ignoredLabels={['BAD']}
      />,
    );
    expect(queryByText('GOOD')).toBeInTheDocument();
    expect(queryByText('BAD')).not.toBeInTheDocument();
  });

  it('Renders object labels', async () => {
    const { queryByText } = render(
      <MetadataTable ownerType="Parent" labels={{ obj: { a: 'b' } }} />,
    );
    expect(queryByText('obj')).toBeInTheDocument();
    expect(queryByText(/"a": "b"/)).toBeInTheDocument();
  });

  it('Renders labels as links', async () => {
    const { queryByRole } = render(
      <MetadataTable ownerType="Parent" labels={{ label1: 'http://1' }} />,
    );

    const link = queryByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe('http://1');
  });
});
