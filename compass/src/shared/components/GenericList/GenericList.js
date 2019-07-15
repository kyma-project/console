import React from "react";
import PropTypes from "prop-types";

import { Panel } from "fundamental-react/lib/Panel";
import { Popover } from "fundamental-react/lib/Popover";
import { Menu } from "fundamental-react/lib/Menu";
import { Button } from "fundamental-react/lib/Button";
import { Search, Filter, TableWithActionsToolbar, TableWithActionsList } from "@kyma-project/react-components";

class GenericList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allFilters: [],
      activeFilters: []
    };
  }

  processActionElement = (actions, entry) => (
    <Popover
      body={
        <Menu>
          <Menu.List>
            {actions.map((
              action,
              id // no unique key error appears here. 'key' is not passed further by Fd-react
            ) => (
              <Menu.Item onClick={() => action.handler(entry)} key={(entry.name || entry.id) + id}>
                {action.name}
              </Menu.Item>
            ))}
          </Menu.List>
        </Menu>
      }
      control={<Button glyph="vertical-grip" option="light" />}
      placement="bottom-end"
    />
  );

  headerRenderer = entries => {
    if (this.props.actions) {
      return [...this.props.headerRenderer(entries), ""];
    } else {
      return this.props.headerRenderer(entries);
    }
  };

  rowRenderer = entry => {
    if (this.props.actions) {
      return [...this.props.rowRenderer(entry), this.processActionElement(this.props.actions, entry)];
    } else {
      return this.props.rowRenderer(entry);
    }
  };

  render() {
    const { entries: apps } = this.props;

    const headerActions = apps => (
      <>
        <Filter data={apps} allFilters={[]} activeFilters={[]} onChange={() => {}} />
        <Search />
      </>
    );

    return (
      <Panel>
        <TableWithActionsToolbar title="Applications" description="Description" children={headerActions(apps)} />
        <TableWithActionsList entries={apps} headerRenderer={this.headerRenderer} rowRenderer={this.rowRenderer} />
      </Panel>
    );
  }
}
export default GenericList;

GenericList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, handler: PropTypes.func }))
};
