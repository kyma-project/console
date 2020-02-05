import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { ResourceNotFound } from '../ResourceNotFound';

const mockNavigate = jest.fn();

jest.mock('@kyma-project/luigi-client', () => ({
  linkManager: () => ({
    fromClosestContext: () => ({
      navigate: mockNavigate,
    }),
  }),
}));

describe('ResourceNotFound', () => {
  it('Renders resource type and breadcrumb', () => {
    const { queryByText } = render(
      <ResourceNotFound
        resource="Resource"
        breadcrumb="Breadcrumb value"
        path=""
      />,
    );

    expect(queryByText("Such Resource doesn't exists.")).toBeInTheDocument();
    expect(queryByText('Breadcrumb value')).toBeInTheDocument();
  });

  it('Navigates to path on click on breadcrumb', () => {
    const { getByText } = render(
      <ResourceNotFound
        resource="Resource"
        breadcrumb="Breadcrumb value"
        path="path"
      />,
    );

    const breadcrumbLink = getByText('Breadcrumb value');
    fireEvent.click(breadcrumbLink);

    expect(mockNavigate).toHaveBeenCalledWith('path');
  });
});
