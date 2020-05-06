import React from 'react';
import { render } from '@testing-library/react';
import Logs from '../Logs';

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.local',
}));

describe('Logs', () => {
  it('Shows message if no labels are present', () => {
    const {queryByText} = render(
      <Logs httpService={{}} queryTransformService={{ toQuery: () => {} }} />,
    );
    
    expect(queryByText('Add at least one label to the filter to see the logs.')).toBeInTheDocument();
  });
});
