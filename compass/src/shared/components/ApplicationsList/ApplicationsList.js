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
    <h1>No elements {entries}</h1>
  );
ApplicationsList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired
};

export default ApplicationsList;
