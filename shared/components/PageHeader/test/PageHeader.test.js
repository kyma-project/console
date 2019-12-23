import React from 'react';
import { render } from '@testing-library/react';
import LuigiClient from '@kyma-project/luigi-client';

import { PageHeader } from '../PageHeader';

// const luigiNavigateMock = jest.fn();
jest.mock('@kyma-project/luigi-client', () => ({
  linkManager: () => ({
    fromClosestContext: () => ({
      navigate: jest.fn(),
    }),
  }),
}));
describe('PageHeader', () => {
  // afterEach(() => {
  //   luigiNavigateMock.mockReset();
  // });

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
  it('Renders one breadcrumbItem with link', async () => {
    const { getByText } = render(
      <PageHeader
        title="page title"
        breadcrumbItems={[{ name: 'item1', path: 'path1' }]}
      />,
    );

    const item = getByText('item1');

    expect(item).toBeInTheDocument();

    await wait();

    item.click();
    expect(
      LuigiClient.linkManager().fromClosestContext().navigate,
    ).toHaveBeenCalled();
  });
});
