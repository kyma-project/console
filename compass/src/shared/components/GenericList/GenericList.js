import React from "react";

import { Panel } from "fundamental-react/lib/Panel";
import { Search, Filter, TableWithActionsToolbar, TableWithActionsList } from "@kyma-project/react-components";

class GenericList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      allFilters: [],
      activeFilters: []
    };
  }

createLabels = (labels) => {
  const separatedLabels = [];
  for (const key in labels) {
    if (labels.hasOwnProperty(key) && labels[key].length > 0) {
      labels[key].forEach(lab => {
      if (lab === 'undefined') {
        separatedLabels.push(key);
      } else {
        separatedLabels.push(key + '=' + lab);
      } 
    });
    }
  }
  const labelsString = separatedLabels.join(', ')
  return labelsString;
}

headerRenderer = application => ["Name", "Description", "Label"];
rowRenderer = application => [<b>{application.name}</b>, application.description, application.labels ? this.createLabels(application.labels) : '-'];

render() {
    const apps = this.props.entries;
     
    const actions = (apps) => (
      <>
        <Filter
          data={apps}
          allFilters={[]}
          activeFilters={[]}
          onChange={() => {}}
          />
          <Search/>
      </>
    )

    return (
      <Panel>
        <TableWithActionsToolbar title="Applications" description="Description" children={actions(apps)} />
        <TableWithActionsList entries={apps} headerRenderer={this.props.headerRenderer} rowRenderer={this.props.rowRenderer } />
      </Panel>
    );
  }
}
export default GenericList;
