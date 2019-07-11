import React from "react";
import PropTypes from "prop-types";

import { Table } from "@kyma-project/react-components";

const prepareRowData = (entries, rowRenderer) =>
  entries.map(entry => ({
    rowData: rowRenderer(entry)
  }));

const ApplicationsList = ({ entries, headerRenderer, rowRenderer }) =>
  entries ? (
    <Table
      headers={headerRenderer(entries)}
      tableData={prepareRowData(entries, rowRenderer)}
      notFoundMessage={"There are no applications available"}
    />
  ) : (
    <h1>No elements</h1>
  );
ApplicationsList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object), // an array of objects to display
  headerRenderer: PropTypes.func.isRequired, // gets the whole data as a param. Must return an array of nodes
  rowRenderer: PropTypes.func.isRequired // gets a single row as a param. Must return an array of nodes
};

export default ApplicationsList;
