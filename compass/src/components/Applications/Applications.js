import React from "react";

import { Panel } from "fundamental-react/lib/Panel";
import { TableWithActionsToolbar, Search, Filter } from "@kyma-project/react-components";
import { Query } from "react-apollo";
import { GET_APPLICATIONS } from "./gql";
import ApplicationsList from "../../shared/components/ApplicationsList/ApplicationsList";

const createLabels = (labels) => {
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

const headerRenderer = application => ["Name", "Description", "Label"];
const rowRenderer = application => [<b>{application.name}</b>, application.description, application.labels ? createLabels(application.labels) : '-'];

const Applications = () => (
  <Query query={GET_APPLICATIONS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const apps = data.applications.data;
      
      const actions = (apps) => (
        <>
          <Filter
            data={apps}
            onChange={() => {}}/>
            <Search/>
        </>
      )

      return (
        <Panel>
          <TableWithActionsToolbar title="Applications" description="Description" children={actions(apps)} />
          <ApplicationsList entries={apps} {...{ headerRenderer, rowRenderer }} />
        </Panel>
      );
    }}
  </Query>
);

export default Applications;
