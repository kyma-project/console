import React from 'react';
import { render } from '@testing-library/react';

import { PageHeader } from '../PageHeader';

const mockNavigate = jest.fn();

jest.mock('@luigi-project/client', () => ({
  linkManager: () => ({
    fromClosestContext: () => ({
      navigate: mockNavigate,
    }),
  }),
}));

describe('PageHeader', () => {
  afterEach(() => {
    mockNavigate.mockReset();
  });

  it('Renders title', () => {
    const { getByText } = render(<PageHeader title="page title" />);

    expect(getByText('page title')).toBeInTheDocument();
  });

  it('Renders actions', () => {
    const { getByLabelText } = render(
      <PageHeader
        title="page title"
        actions={<button aria-label="abc"></button>}
      />,
    );

    expect(getByLabelText('abc')).toBeInTheDocument();
  });

  it('Renders one breadcrumbItem with link', () => {
    const breadcrumbItems = [{ name: 'item1', path: 'path1' }];
    const { getByText } = render(
      <PageHeader title="page title" breadcrumbItems={breadcrumbItems} />,
    );

    const item = getByText('item1');

    expect(item).toBeInTheDocument();

    item.click();

    expect(mockNavigate).toHaveBeenCalledWith(breadcrumbItems[0].path);
  });
});
