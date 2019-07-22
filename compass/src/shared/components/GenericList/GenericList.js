import React from 'react';
import PropTypes from 'prop-types';

import { Panel } from 'fundamental-react/lib/Panel';

import {
  Search,
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

  renderSearchList = entries => {
    const filteredEntries =
      entries && entries.length
        ? entries.map(entry => {
            return entry.name !== undefined && entry.description !== undefined
              ? [
                  {
                    text: entry.name.substring(0, 18),
                    callback: () => this.handleQueryChange(entry.name),
                  },
                  {
                    text: entry.description.substring(0, 18),
                    callback: () => this.handleQueryChange(entry.description),
                  },
                ]
              : entries;
          })
        : null;
    return Array.isArray(filteredEntries) ? filteredEntries.flat() : entries;
  };

  handleQueryChange = event => {
    const searchTerm = event.target.value;
    this.setState(prevState => ({
      filteredEntries: filterEntries(prevState.entries, searchTerm),
    }));
  };

  resetList() {
    this.setState({ filteredEntries: this.props.entries });
  }

  render() {
    const { filteredEntries } = this.state;
    const { extraHeaderContent } = this.props;

    const headerActions = filteredEntries => (
      <>
        {extraHeaderContent}
        {/* {this.processFilterElement(allFilters)} */}
        <Search
          placeholder="Search..."
          onChange={this.handleQueryChange}
          searchList={this.renderSearchList(filteredEntries)}
        />
      </>
    );

    return (
      <Panel className="fd-panel--no-background">
        <TableWithActionsToolbar
          title={this.props.title}
          description={this.props.description}
          children={headerActions(filteredEntries)}
        />

        <Panel.Body>
          <TableWithActionsList
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
