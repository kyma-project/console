import React from "react";

import { Query } from "react-apollo";
import { Panel } from "fundamental-react/lib/Panel";
import { GET_APPLICATIONS } from "../gql";
import { Table } from "@kyma-project/react-components";

const prepareRowData = applicationsArray =>
applicationsArray.map(application => ({
  rowData: [
    <span>
      {application.name}
    </span>,
    application.description
  ]
}));

const ApplicationsList = () => (
  <Query query={GET_APPLICATIONS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <Panel>
          <Panel.Header>
            <Panel.Head title="Applications" />
          </Panel.Header>
          <Panel.Body>
            <Table
              headers={["Name", "Description"]}
              tableData={prepareRowData(data.applications.data)}
              notFoundMessage={"There are no applications available"}
            />
          </Panel.Body>
        </Panel>
      );
    }}
  </Query>
);

export default ApplicationsList;
