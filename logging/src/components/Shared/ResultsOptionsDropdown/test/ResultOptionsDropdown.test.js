import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ResultsOptionsDropdown from './../ResultsOptionsDropdown';
import {
  SearchParamsContext,
  defaultSearchParams,
  actions,
} from '../../../Logs/SearchParams.reducer';

describe('ResultsOptionsDropdown', () => {
  //Popover's Warning: `NaN` is an invalid value for the `left` css style property.
  console.error = jest.fn();

  it('Renders with minimal props', () => {
    const { getByRole, getByLabelText } = render(
      <SearchParamsContext.Provider
        value={[
          { ...defaultSearchParams, showHealthChecks: true },
          actions(jest.fn()),
        ]}
      >
        <ResultsOptionsDropdown />
      </SearchParamsContext.Provider>,
    );

    // open dropdown
    fireEvent.click(getByRole('button'));

    expect(getByLabelText(/health checks/)).toBeChecked();
  });

  it('Dispatches event on click on checkbox', () => {
    const actionsMock = {
      setShowHealthChecks: jest.fn(),
    };

    const { getByRole, getByLabelText } = render(
      <SearchParamsContext.Provider value={[defaultSearchParams, actionsMock]}>
        <ResultsOptionsDropdown />
      </SearchParamsContext.Provider>,
    );

    // open dropdown
    fireEvent.click(getByRole('button'));

    // check
    fireEvent.click(getByLabelText(/health checks/));

    expect(actionsMock.setShowHealthChecks).toHaveBeenCalledWith(true);
  });
});
