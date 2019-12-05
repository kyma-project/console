import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchInput from './SearchInput';
import { Panel } from 'fundamental-react/Panel';
import { filterEntries } from './helpers';
import ListActions from './ListActions/ListActions';

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

  const HeaderRenderer = ({ entries }) => {
    let headerElements = [];
    if (actions) {
      headerElements = [...headerRenderer(entries), ''];
    } else {
      headerElements = headerRenderer(entries);
    }

    return headerElements.map(h => <th key={h}>{h}</th>);
  };

  const RowRenderer = ({ entry }) => {
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

  useEffect(() => {
    if (entries && entries.length) {
      setFilteredEntries(
        filterEntries([...entries], searchQuery, textSearchProperties),
      );
    }
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
              <HeaderRenderer entries={entries} />
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map(e => (
              <tr key={e.id}>
                <RowRenderer entry={e} />
              </tr>
            ))}
          </tbody>
        </table>
      </Panel.Body>
    </Panel>
  );
};

GenericList.Actions = ListActions;

GenericList.propTypes = {
  title: PropTypes.string,
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
  actions: [],
  showSearchField: true,
  textSearchProperties: ['name', 'description'],
};
