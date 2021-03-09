import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Header from './../Header';
import {
  actions,
  defaultSearchParams,
  SearchParamsContext,
} from '../../Logs/SearchParams.reducer';

describe('Header', () => {
  it('Shows / hides advanced settings when corresponding button is clicked', () => {
    const mockActions = {
      setLogsPeriod: jest.fn(),
      setSortDir: jest.fn(),
    };

    const { queryByText } = render(
      <SearchParamsContext.Provider value={[defaultSearchParams, mockActions]}>
        <Header />
      </SearchParamsContext.Provider>,
    );

    // should be initially hidden
    const advancedOptionsToggle = queryByText('Show Advanced Settings');
    expect(advancedOptionsToggle).toBeInTheDocument();
    expect(queryByText('Advanced Settings')).not.toBeInTheDocument();

    // toggle
    fireEvent.click(advancedOptionsToggle);
    expect(advancedOptionsToggle).toHaveTextContent('Hide Advanced Settings');
    expect(queryByText('Advanced Settings')).toBeInTheDocument();
  });
});
