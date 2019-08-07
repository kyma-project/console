import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SearchInput from './SearchInput';

import { Panel } from 'fundamental-react/lib/Panel';

import {
  TableWithActionsToolbar,
  TableWithActionsList,
} from '@kyma-project/react-components';

import { filterEntries } from './helpers';
import { renderActionElement } from './internalRenderers';

class GenericList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: props.entries,
      filteredEntries: props.entries,
      searchTerm: '',
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
    if (this.props.actions) {
      return [
        ...this.props.rowRenderer(entry),
        renderActionElement(this.props.actions, entry),
      ];
    } else {
      return this.props.rowRenderer(entry);
    }
  };

  handleQueryChange = searchTerm => {
    this.setState(prevState => ({
      filteredEntries: filterEntries(prevState.entries, searchTerm),
      searchTerm,
    }));
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.entries, prevState.entries)) {
      return {
        filteredEntries: filterEntries(nextProps.entries, prevState.searchTerm),
        entries: nextProps.entries,
      };
    }
    return null;
  }

  render() {
    const { filteredEntries, searchTerm } = this.state;
    const { extraHeaderContent, notFoundMessage } = this.props;

    const headerActions = (
      <>
        {extraHeaderContent}
        <SearchInput
          searchTerm={searchTerm}
          filteredEntries={filteredEntries}
          handleQueryChange={this.handleQueryChange}
        />
      </>
    );

    return (
      <Panel className="fd-panel--no-background">
        <TableWithActionsToolbar
          title={this.props.title}
          description={this.props.description}
          children={headerActions}
        />

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
export default GenericList;

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
};
