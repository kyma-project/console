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
import ListActions from './ListActions/ListActions';

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
  textSearchProperties,
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
        <ListActions actions={actions} entry={entry} />,
      ];
    } else {
      return rowRenderer(entry);
    }
  };

  useEffect(() => {
    if (entries && entries.length) {
      setFilteredEntries(
        filterEntries([...entries], searchQuery, textSearchProperties),
      );
    }
  }, [searchQuery, setFilteredEntries, entries]);

  const headerActions = (
    <>
      {extraHeaderContent}
      {showSearchField && (
        <SearchInput
          searchQuery={searchQuery}
          filteredEntries={filteredEntries}
          handleQueryChange={setSearchQuery}
          suggestionProperties={textSearchProperties}
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

GenericList.Actions = ListActions;

GenericList.propTypes = {
  title: PropTypes.string,
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
  textSearchProperties: PropTypes.arrayOf(PropTypes.string.isRequired),
};

GenericList.defaultProps = {
  showSearchField: true,
  textSearchProperties: ['name', 'description'],
};
