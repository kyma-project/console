import React from 'react';
import PropTypes from 'prop-types';
import './CompactHeader.scss';
import { PERIODS, SORT_TYPES } from '../../constants';

import { Panel } from 'fundamental-react';

import SearchInput from './../Shared/SearchInput/SearchInput';
import OptionsDropdown from '../Shared/SelectDropdown/SelectDropdown';
import AutoRefreshButton from './../Shared/AutoRefreshButton/AutoRefreshButton';
import ResultOptionsDropdown from '../Shared/ResultsOptionsDropdown/ResultsOptionsDropdown';

CompactHeader.propTypes = {
  updateFilteringState: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  logsPeriod: PropTypes.oneOf(PERIODS),
  sortDirection: PropTypes.oneOf(SORT_TYPES),
  advancedSettings: PropTypes.object.isRequired,
  autoRefreshEnabled: PropTypes.bool.isRequired,
};

export default function CompactHeader({
  updateFilteringState,
  searchPhrase,
  logsPeriod,
  sortDirection,
  advancedSettings,
  autoRefreshEnabled,
}) {
  function updateLogsPeriod(logsPeriod) {
    updateFilteringState({ logsPeriod });
  }

  function updateSortDirection(sortDirection) {
    updateFilteringState({ sortDirection });
  }

  return (
    <Panel className="fd-has-padding-regular fd-has-padding-bottom-tiny">
      <section className="compact-header">
        <h1 className="fd-has-type-3">Logs</h1>
        <div className="fd-has-display-flex">
          <SearchInput
            searchPhrase={searchPhrase}
            updateFilteringState={updateFilteringState}
            compact={true}
          />
          <ResultOptionsDropdown
            advancedSettings={advancedSettings}
            updateFilteringState={updateFilteringState}
          />
          <AutoRefreshButton
            autoRefreshEnabled={autoRefreshEnabled}
            updateParentState={updateFilteringState}
          />
          <OptionsDropdown
            availabelValues={PERIODS}
            currentValue={logsPeriod}
            icon="past"
            updateValue={updateLogsPeriod}
            compact={true}
          />
          <OptionsDropdown
            availabelValues={SORT_TYPES}
            currentValue={sortDirection}
            icon="sort"
            updateValue={updateSortDirection}
            compact={true}
          />
        </div>
      </section>
    </Panel>
  );
}
