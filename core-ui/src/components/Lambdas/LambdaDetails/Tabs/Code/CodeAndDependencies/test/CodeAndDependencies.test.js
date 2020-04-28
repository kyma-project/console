import React from 'react';
import { render } from '@testing-library/react';

import { lambdaMock } from 'components/Lambdas/helpers/testing';

import { CODE_AND_DEPENDENCIES_PANEL } from 'components/Lambdas/constants';

import CodeAndDependencies from '../CodeAndDependencies';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => ({
      backendModules: [],
    }),
  };
});

describe('CodeAndDependencies', () => {
  it('should render tabs with source and dependencies', async () => {
    const { queryByText } = render(<CodeAndDependencies lambda={lambdaMock} />);

    expect(
      queryByText(CODE_AND_DEPENDENCIES_PANEL.TABS.CODE),
    ).toBeInTheDocument();
    expect(
      queryByText(CODE_AND_DEPENDENCIES_PANEL.TABS.CODE),
    ).toBeInTheDocument();
  });
});
