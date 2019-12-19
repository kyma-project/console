import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchInput from './SearchInput';
import { Panel } from 'fundamental-react/Panel';
import { filterEntries } from './helpers';
import ListActions from '../ListActions/ListActions';
import './GenericList.scss';

const NotFoundMessage = ({ children }) => (
  <td colSpan="100%">
    <p className="not-found-message">{children}</p>
  </td>
);

const HeaderRenderer = ({ entries, actions, headerRenderer }) => {
  let emptyColumn = [];
  if (actions.length) {
    emptyColumn = [<th key="actions-column" aria-label="actions-column"></th>];
  }
  return [headerRenderer().map(h => <th key={h}>{h}</th>), ...emptyColumn];
};

const RowRenderer = ({ entry, actions, rowRenderer }) => {
  const filteredActions = actions.filter(a =>
    a.skipAction ? !a.skipAction(entry) : true,
  );
  let rowElement = [];

  if (filteredActions.length) {
    rowElement = [
      ...rowRenderer(entry),
      <ListActions actions={filteredActions} entry={entry} />,
    ];
  } else {
    rowElement = rowRenderer(entry);
  }
  return rowElement.map((cell, id) => <td key={id}>{cell}</td>);
};

export const GenericList = ({
  entries,
  actions,
  title,
  headerRenderer,
  rowRenderer,
  notFoundMessage,
  extraHeaderContent,
  showSearchField,
  textSearchProperties,
}) => {
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFilteredEntries(
      filterEntries([...entries], searchQuery, textSearchProperties),
    );
  }, [searchQuery, setFilteredEntries, entries]);

  const headerActions = (
    <section className="generic-list__search">
      {showSearchField && (
        <SearchInput
          searchQuery={searchQuery}
          filteredEntries={filteredEntries}
          handleQueryChange={setSearchQuery}
          suggestionProperties={textSearchProperties}
        />
      )}
      {extraHeaderContent}
    </section>
  );

  return (
    <Panel className="fd-has-margin-m generic-list">
      <Panel.Header className="fd-has-padding-xs">
        <Panel.Head title={title} />
        {headerActions}
      </Panel.Header>

      <Panel.Body>
        <table className="fd-table">
          <thead>
            <tr>
              <HeaderRenderer
                entries={entries}
                actions={actions}
                headerRenderer={headerRenderer}
              />
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length ? (
              filteredEntries.map((e, index) => (
                <tr role="row" key={e.id || e.name || index}>
                  <RowRenderer
                    entry={e}
                    actions={actions}
                    rowRenderer={rowRenderer}
                  />
                </tr>
              ))
            ) : (
              <tr>
                <NotFoundMessage>{notFoundMessage}</NotFoundMessage>
              </tr>
            )}
          </tbody>
        </table>
      </Panel.Body>
    </Panel>
  );
};

GenericList.Actions = ListActions;

GenericList.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      handler: PropTypes.func.isRequired,
      skipAction: PropTypes.func,
    }),
  ).isRequired,
  extraHeaderContent: PropTypes.node,
  showSearchField: PropTypes.bool,
  notFoundMessage: PropTypes.string,
  textSearchProperties: PropTypes.arrayOf(PropTypes.string.isRequired),
};

GenericList.defaultProps = {
  notFoundMessage: 'No entries found',
  actions: [],
  showSearchField: true,
  textSearchProperties: ['name', 'description'],
};
