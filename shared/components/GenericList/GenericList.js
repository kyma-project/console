import React, { useState, useEffect } from 'react';
import { Panel, Pagination } from 'fundamental-react';

import SearchInput from './SearchInput';
import ListActions from '../ListActions/ListActions';
import { Spinner } from '../Spinner/Spinner';
import { HeaderRenderer, RowRenderer, BodyFallback } from './components';

import { filterEntries } from './helpers';
import { MESSAGES } from './constants';
import classnames from 'classnames';

import PropTypes from 'prop-types';
import CustomPropTypes from '../../typechecking/CustomPropTypes';

import './GenericList.scss';

export const GenericList = ({
  entries = [],
  entriesKind,
  actions,
  title,
  headerRenderer,
  rowRenderer,
  notFoundMessage,
  noSearchResultMessage,
  serverErrorMessage,
  extraHeaderContent,
  showSearchField,
  textSearchProperties,
  showSearchSuggestion,
  showSearchControl,
  actionsStandaloneItems,
  testid,
  showRootHeader,
  showHeader,
  serverDataError,
  serverDataLoading,
  hasExternalMargin,
  pagination,
  compact,
}) => {
  const [currentPage, setCurrentPage] = React.useState(
    (pagination && pagination.initialPage) || 1,
  );
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCurrentPage(1);
    setFilteredEntries(
      filterEntries([...entries], searchQuery, textSearchProperties),
    );
  }, [searchQuery, setFilteredEntries, entries]);

  const headerActions = (
    <section className="generic-list__search">
      {showSearchField && (
        <SearchInput
          entriesKind={entriesKind || title || ''}
          searchQuery={searchQuery}
          filteredEntries={filteredEntries}
          handleQueryChange={setSearchQuery}
          suggestionProperties={textSearchProperties}
          showSuggestion={showSearchSuggestion}
          showSearchControl={showSearchControl}
          disabled={!entries.length}
        />
      )}
      {extraHeaderContent}
    </section>
  );

  const renderTableBody = () => {
    if (serverDataError) {
      return (
        <BodyFallback>
          <p>{serverErrorMessage}</p>
        </BodyFallback>
      );
    }

    if (serverDataLoading) {
      return (
        <BodyFallback>
          <Spinner />
        </BodyFallback>
      );
    }

    if (!filteredEntries.length) {
      if (searchQuery) {
        return (
          <BodyFallback>
            <p>{noSearchResultMessage}</p>
          </BodyFallback>
        );
      }
      return (
        <BodyFallback>
          <p>{notFoundMessage}</p>
        </BodyFallback>
      );
    }

    let pagedItems = filteredEntries;
    if (pagination) {
      pagedItems = filteredEntries.slice(
        (currentPage - 1) * pagination.itemsPerPage,
        currentPage * pagination.itemsPerPage,
      );
    }

    return pagedItems.map((e, index) => (
      <RowRenderer
        key={e.id || e.name || index}
        entry={e}
        actions={actions}
        actionsStandaloneItems={actionsStandaloneItems}
        rowRenderer={rowRenderer}
        compact={compact}
      />
    ));
  };

  const tableClassNames = classnames('fd-table', { compact });
  const panelClassNames = classnames('generic-list', {
    'fd-has-margin-m': hasExternalMargin,
  });

  return (
    <Panel className={panelClassNames} data-testid={testid}>
      {showRootHeader && (
        <Panel.Header className="fd-has-padding-xs">
          <Panel.Head title={title} />
          <Panel.Actions>{headerActions}</Panel.Actions>
        </Panel.Header>
      )}

      <Panel.Body>
        <table className={tableClassNames}>
          {showHeader && (
            <thead>
              <tr>
                <HeaderRenderer
                  entries={entries}
                  actions={actions}
                  headerRenderer={headerRenderer}
                />
              </tr>
            </thead>
          )}
          <tbody>{renderTableBody()}</tbody>
        </table>
      </Panel.Body>
      {!!pagination &&
        (!pagination.autoHide ||
          filteredEntries.length > pagination.itemsPerPage) && (
          <Panel.Footer>
            <Pagination
              itemsTotal={filteredEntries.length}
              initialPage={currentPage}
              itemsPerPage={pagination.itemsPerPage}
              onClick={setCurrentPage}
            />
          </Panel.Footer>
        )}
    </Panel>
  );
};

GenericList.Actions = ListActions;

const PaginationProps = PropTypes.shape({
  itemsPerPage: PropTypes.number.isRequired,
  initialPage: PropTypes.number,
  autoHide: PropTypes.bool,
});

GenericList.propTypes = {
  title: PropTypes.string,
  entriesKind: PropTypes.string,
  entries: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  ).isRequired,
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  actions: CustomPropTypes.listActions,
  extraHeaderContent: PropTypes.node,
  showSearchField: PropTypes.bool,
  notFoundMessage: PropTypes.string,
  noSearchResultMessage: PropTypes.string,
  serverErrorMessage: PropTypes.string,
  textSearchProperties: PropTypes.arrayOf(PropTypes.string.isRequired),
  showSearchSuggestion: PropTypes.bool,
  showSearchControl: PropTypes.bool,
  actionsStandaloneItems: PropTypes.number,
  testid: PropTypes.string,
  showRootHeader: PropTypes.bool,
  showHeader: PropTypes.bool,
  serverDataError: PropTypes.any,
  serverDataLoading: PropTypes.bool,
  hasExternalMargin: PropTypes.bool,
  pagination: PaginationProps,
  compact: PropTypes.bool,
};

GenericList.defaultProps = {
  notFoundMessage: MESSAGES.NOT_FOUND,
  noSearchResultMessage: MESSAGES.NO_SEARCH_RESULT,
  serverErrorMessage: MESSAGES.SERVER_ERROR,
  actions: [],
  textSearchProperties: ['name', 'description'],
  showSearchField: true,
  showSearchControl: true,
  showRootHeader: true,
  showHeader: true,
  showSearchSuggestion: true,
  showSearchControl: true,
  serverDataError: null,
  serverDataLoading: false,
  hasExternalMargin: true,
  compact: true,
};
