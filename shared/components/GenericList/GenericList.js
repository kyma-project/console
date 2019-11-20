import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SearchInput from './SearchInput';
import './style.scss';

import { Panel } from 'fundamental-react/Panel';

import { TableWithActionsList } from '@kyma-project/react-components';

import { filterEntries } from './helpers';
import { renderActionElement } from './internalRenderers';

export class GenericList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: props.entries,
      filteredEntries: props.entries,
      searchQuery: '',
    };
  }

  headerRenderer = entries => {
    if (this.props.actions) {
      return [...this.props.headerRenderer(entries), ''];
    } else {
      return this.props.headerRenderer(entries);
    }
  };

  rowRenderer = entry => {
    const actions = this.props.actions
      ? this.props.actions.filter(action =>
          action.skipAction ? !action.skipAction(entry) : true,
        )
      : [];
    if (actions.length > 0) {
      return [
        ...this.props.rowRenderer(entry),
        renderActionElement(actions, entry),
      ];
    } else {
      return this.props.rowRenderer(entry);
    }
  };

  handleQueryChange = searchQuery => {
    this.setState(prevState => ({
      filteredEntries: filterEntries(
        prevState.entries,
        searchQuery,
        this.props.textSearchProperties,
      ),
      searchQuery,
    }));
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.entries, prevState.entries)) {
      return {
        filteredEntries: filterEntries(
          nextProps.entries,
          prevState.searchQuery,
          nextProps.textSearchProperties,
        ),
        entries: nextProps.entries,
      };
    }
    return null;
  }

  render() {
    const { filteredEntries, searchQuery } = this.state;
    const {
      extraHeaderContent,
      notFoundMessage,
      showSearchField,
      textSearchProperties,
    } = this.props;

    const headerActions = (
      <section>
        {showSearchField && (
          <SearchInput
            searchQuery={searchQuery}
            filteredEntries={filteredEntries}
            handleQueryChange={this.handleQueryChange}
            suggestionProperties={textSearchProperties}
          />
        )}
        {extraHeaderContent}
      </section>
    );

    return (
      <Panel className="fd-has-margin-m generic-list">
        <Panel.Header className="fd-has-padding-xs">
          <Panel.Head title={this.props.title} />
          {headerActions}
        </Panel.Header>

        <Panel.Body>
          <TableWithActionsList
            notFoundMessage={notFoundMessage || 'There are no items to show'}
            entries={filteredEntries}
            headerRenderer={this.headerRenderer}
            rowRenderer={this.rowRenderer}
          />
        </Panel.Body>
      </Panel>
    );
  }
}

GenericList.propTypes = {
  title: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(PropTypes.object),
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, handler: PropTypes.func }),
  ),
  extraHeaderContent: PropTypes.node,
  showSearchField: PropTypes.bool,
  textSearchProperties: PropTypes.arrayOf(PropTypes.string.isRequired),
};

GenericList.defaultProps = {
  showSearchField: true,
  textSearchProperties: ['name', 'description'],
};
