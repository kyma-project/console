import React from 'react';
import TenantSearch from '../TenantSearch';
import { render, fireEvent } from '@testing-library/react';

const mockedTenants = [
  {
    name: 'tenant-1',
    id: 'id-1',
  },
  {
    name: 'tenant-2',
    id: 'id-2',
  },
];

const mockNavigate = jest.fn();
jest.mock('@kyma-project/luigi-client', () => ({
  getContext: () => ({ tenants: mockedTenants }),
  getNodeParams: () => ({ parentPath: '/' }),
  linkManager: () => ({ navigate: mockNavigate }),
}));

describe('TenantSearch', () => {
  it('Renders list of tenants', async () => {
    const { queryAllByRole } = render(<TenantSearch />);

    expect(queryAllByRole('row')).toHaveLength(mockedTenants.length);
  });

  it('Focuses search field on load', async () => {
    const { queryByRole } = render(<TenantSearch />);

    expect(queryByRole('search')).toHaveFocus();
  });

  it('Filters list by tenant name', async () => {
    const { getByRole, queryByText } = render(<TenantSearch />);

    fireEvent.change(getByRole('search'), {
      target: { value: 'tenant-1' },
    });

    expect(queryByText(/id-1/)).toBeInTheDocument();
    expect(queryByText(/id-2/)).not.toBeInTheDocument();
  });

  it('Filters list by tenant id', async () => {
    const { getByRole, queryByText } = render(<TenantSearch />);

    fireEvent.change(getByRole('search'), {
      target: { value: 'id-2' },
    });

    expect(queryByText(/tenant-1/)).not.toBeInTheDocument();
    expect(queryByText(/tenant-2/)).toBeInTheDocument();
  });

  it('Fires navigation event when user clicks tenant entry', async () => {
    const { getByText } = render(<TenantSearch />);

    fireEvent.click(getByText(/tenant-1/));

    expect(mockNavigate).toHaveBeenCalled();
  });
});
