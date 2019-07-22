import React from "react";
import PropTypes from 'prop-types';
import { Panel, Table, Button } from "@kyma-project/react-components";
import { Pagination } from "fundamental-react/lib/Pagination";
import { Popover } from "fundamental-react/lib/Popover";
import { Menu } from "fundamental-react/lib/Menu";
import ApiDeleteModal from "./ApiDeleteModal";

function createTableData(apis, applicationId) {
  const PopoverBody = props => {
    return (
      <Menu>
        <Menu.List>
          <ApiDeleteModal
            api={props.api}
            applicationId={applicationId}
            modalOpeningComponent={<Menu.Item urlProps={{ key: "delete" }}>Delete</Menu.Item>}
          />
        </Menu.List>
      </Menu>
    );
  };

  return apis.map(api => ({
    rowData: [
      api.name,
      api.description,
      api.targetURL,
      <div className="fd-col--2 fd-has-text-align-center">
        <Popover
          body={<PopoverBody api={api} />}
          control={<Button glyph="horizontal-grip" option="light" />}
          placement="bottom-end"
        />
      </div>
    ]
  }));
}

ApplicationDetailsApis.propTypes = {
  apis: PropTypes.object.isRequired,
};

export default function ApplicationDetailsApis(props) {
  const { totalCount, data: apis } = props.apis;

  return (
    <Panel className="fd-has-margin-top-small">
      <Panel.Body>
        <Panel.Header>
          <Panel.Head title="APIs" />
        </Panel.Header>
        <Table
          headers={["Name", "Description", "Target URL", ""]}
          tableData={createTableData(apis, props.applicationId)}
          notFoundMessage={"There are no APIs available"}
        />
        {!!totalCount && (
          <Pagination
            displayTotal={false}
            itemsTotal={totalCount || 0}
            itemsPerPage={8}
            onClick={() => console.log("will be done in #1039")}
            className="fd-has-padding-top-small"
          />
        )}
      </Panel.Body>
    </Panel>
  );
}
