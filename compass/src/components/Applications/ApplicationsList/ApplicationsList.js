import React from "react";

import { Table } from "@kyma-project/react-components";

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

const prepareRowData = applicationsArray =>
applicationsArray.map(application => ({
  rowData: [
    <span>
      {application.name}
    </span>,
    application.description,
    application.labels ? createLabels(application.labels) : '-'
  ]
}));

const ApplicationsList = ({data}) => (
  <Table
    headers={["Name", "Description", "Labels"]}
    tableData={prepareRowData(data)}
    notFoundMessage={"There are no applications available"}
  />
);

export default ApplicationsList;
