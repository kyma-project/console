import React from "react";
import PropTypes from "prop-types";

import { Panel } from "fundamental-react/lib/Panel";

import { Search, TableWithActionsToolbar, TableWithActionsList } from "@kyma-project/react-components";

import { filterEntries } from "./helpers";
import { renderActionElement } from "./internalRenderers";

class GenericList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: props.entries,
      filteredEntries: props.entries
    };
  }

  headerRenderer = entries => {
    if (this.props.actions) {
      return [...this.props.headerRenderer(entries), ""];
    } else {
      return this.props.headerRenderer(entries);
    }
  };

  rowRenderer = entry => {
    if (this.props.actions) {
      return [...this.props.rowRenderer(entry), renderActionElement(this.props.actions, entry)];
    } else {
      return this.props.rowRenderer(entry);
    }
  };

  renderSearchList = entries => {
    const filteredEntries =
      entries && entries.length
        ? entries.map(entry => {
            return [
              { text: entry.name.substring(0, 18), callback: () => this.handleQueryChange(entry.name) },
              {
                text: entry.description.substring(0, 18),
                callback: () => this.handleQueryChange(entry.description)
              }
            ];
          })
        : null;
    return Array.isArray(filterEntries) ? filteredEntries.flat() : entries;
  };

  handleQueryChange = query => {
    this.setState(prevState => ({
      filteredEntries: filterEntries(prevState.entries, query)
    }));
  };

  render() {
    const { filteredEntries } = this.state;

    const headerActions = filteredEntries => (
      <>
        {/* {this.processFilterElement(allFilters)} */}
        <Search
          onEnter={this.handleQueryChange}
          placeholder="Type your query"
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

        <Panel.Body className="abc">
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
  actions: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, handler: PropTypes.func }))
};
