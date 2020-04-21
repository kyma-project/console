import React from 'react';
import LabelsTable from '../LabelsTable';
import { render } from '@testing-library/react';

describe('LabelsTable', () => {
  it('Renders empty table', async () => {
    const { queryByText } = render(<LabelsTable ownerType="Entity" />);
    expect(queryByText(/This Entity doesn't/)).toBeInTheDocument();
  });

  it('Renders labels', async () => {
    const { queryByText } = render(
      <LabelsTable ownerType="Parent" labels={{ label1: 'value1' }} />,
    );
    expect(queryByText('label1')).toBeInTheDocument();
    expect(queryByText('value1')).toBeInTheDocument();
  });

  it('Does not render ignored labels', async () => {
    const { queryByText } = render(
      <LabelsTable
        ownerType="Ennio"
        labels={{ GOOD: 5, BAD: 6 }}
        ignoredLabels={['BAD']}
      />,
    );
    expect(queryByText('GOOD')).toBeInTheDocument();
    expect(queryByText('BAD')).not.toBeInTheDocument();
  });

  it('Renders labels', async () => {
    const { queryByRole } = render(
      <LabelsTable ownerType="Parent" labels={{ label1: 'http://1' }} />,
    );

    const link = queryByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe('http://1');
  });
});
