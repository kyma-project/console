import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SearchInput from './SearchInput';

import { Panel } from 'fundamental-react/Panel';

import {
  TableWithActionsToolbar,
  TableWithActionsList,
  TabsHeader,
} from '@kyma-project/react-components';

import { filterEntries } from './helpers';
import { renderActionElement } from './internalRenderers';

export const GenericList = ({
  entries,
  actions,
  title,
  description,
  headerRenderer,
  rowRenderer,
  notFoundMessage,
  extraHeaderContent,
  showSearchField,
}) => {
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const [searchQuery, setSearchQuery] = useState('');

  const HeaderRenderer = entries => {
    if (actions) {
      return [...headerRenderer(entries), ''];
    } else {
      return headerRenderer(entries);
    }
  };

  const RowRenderer = entry => {
    // const actions = actions
    //   ? actions.filter(action =>
    //       action.skipAction ? !action.skipAction(entry) : true,
    //     )
    //   : [];
    if (actions) {
      return [
        ...rowRenderer(entry),
        // renderActionElement(actions, entry),
      ];
    } else {
      return rowRenderer(entry);
    }
  };

  useEffect(() => {
    setFilteredEntries(filterEntries, searchQuery);
  }, [searchQuery, setFilteredEntries]);

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (!_.isEqual(nextProps.entries, prevState.entries)) {
  //     return {
  //       filteredEntries: filterEntries(
  //         nextProps.entries,
  //         prevState.searchQuery,
  //       ),
  //       entries: nextProps.entries,
  //     };
  //   }
  //   return null;
  // }

  const headerActions = (
    <>
      {extraHeaderContent}
      {showSearchField && (
        <SearchInput
          searchQuery={searchQuery}
          filteredEntries={filteredEntries}
          handleQueryChange={setSearchQuery}
        />
      )}
    </>
  );

  return (
    <Panel className="fd-panel--no-background">
      <TableWithActionsToolbar
        title={title}
        description={description}
        children={headerActions}
      />

      <Panel.Body>
        <TableWithActionsList
          notFoundMessage={notFoundMessage || 'There are no items to show'}
          entries={filteredEntries}
          headerRenderer={HeaderRenderer}
          rowRenderer={RowRenderer}
        />
      </Panel.Body>
    </Panel>
  );
};

GenericList.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  entries: PropTypes.arrayOf(PropTypes.object),
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, handler: PropTypes.func }),
  ),
  extraHeaderContent: PropTypes.node,
  showSearchField: PropTypes.bool,
  notFoundMessage: PropTypes.string,
};

GenericList.defaultProps = {
  showSearchField: true,
};
