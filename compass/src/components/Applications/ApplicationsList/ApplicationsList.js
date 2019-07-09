import React from "react";

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

const ApplicationsList = ({data}) => (
  <Table
    headers={["Name", "Description"]}
    tableData={prepareRowData(data.applications.data)}
    notFoundMessage={"There are no applications available"}
  />
);

export default ApplicationsList;
