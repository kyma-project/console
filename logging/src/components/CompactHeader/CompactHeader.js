import React, { useContext } from 'react';
import './CompactHeader.scss';
import { PERIODS, SORT_DROPDOWN_VALUES } from '../../constants';

import { Panel } from 'fundamental-react';

import SearchInput from './../Shared/SearchInput/SearchInput';
import SelectDropdown from '../Shared/SelectDropdown/SelectDropdown';
import AutoRefreshButton from './../Shared/AutoRefreshButton/AutoRefreshButton';
import ResultOptionsDropdown from '../Shared/ResultsOptionsDropdown/ResultsOptionsDropdown';
import { SearchParamsContext } from '../Logs/SearchParams.reducer';

export default function CompactHeader() {
  const [state, actions] = useContext(SearchParamsContext);
  const { logsPeriod, sortDirection } = state;

  return (
    <Panel className="fd-has-padding-small fd-has-padding-right-regular fd-has-padding-left-regular sticky-header">
      <section className="compact-header">
        <h1 className="fd-has-type-3">Logs</h1>
        <div className="fd-has-display-flex">
          <SearchInput compact={true} />
          <ResultOptionsDropdown />
          <AutoRefreshButton />
          <SelectDropdown
            availableValues={PERIODS}
            currentValue={logsPeriod}
            icon="past"
            updateValue={actions.setLogsPeriod}
            compact={true}
          />
          <SelectDropdown
            availableValues={SORT_DROPDOWN_VALUES}
            currentValue={sortDirection}
            icon="sort"
            updateValue={actions.setSortDir}
            compact={true}
          />
        </div>
      </section>
    </Panel>
  );
}
