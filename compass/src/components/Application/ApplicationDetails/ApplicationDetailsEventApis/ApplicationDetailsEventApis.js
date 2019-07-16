import React from "react";
import PropTypes from 'prop-types';
import { Panel, Table, Button } from "@kyma-project/react-components";
import { Pagination } from "fundamental-react/lib/Pagination";
import { Popover } from "fundamental-react/lib/Popover";
import { Menu } from "fundamental-react/lib/Menu";
import EventApiDeleteModal from "./EventApiDeleteModal";

function createTableData(eventApis, applicationId) {
  const PopoverBody = props => {
    return (
      <Menu>
        <Menu.List>
          <EventApiDeleteModal
            eventApi={props.eventApi}
            applicationId={applicationId}
            modalOpeningComponent={<Menu.Item urlProps={{ key: "delete" }}>Delete</Menu.Item>}
          />
        </Menu.List>
      </Menu>
    );
  };

  return eventApis.map(eventApi => ({
    rowData: [
      eventApi.name,
      eventApi.description,
      <div className="fd-col--2 fd-has-text-align-center">
        <Popover
          body={<PopoverBody eventApi={eventApi} />}
          control={<Button glyph="horizontal-grip" option="light" />}
          placement="bottom-end"
        />
      </div>
    ]
  }));
}

ApplicationDetailsEventApis.propTypes = {
  eventApis: PropTypes.object.isRequired
};

export default function ApplicationDetailsEventApis(props) {
  const { totalCount, data: eventApis } = props.eventApis;

  return (
    <Panel className="fd-has-margin-top-medium">
      <Panel.Body>
        <Panel.Header>
          <Panel.Head title="Event APIs" />
        </Panel.Header>
        <Table
          headers={["Name", "Description", ""]}
          tableData={createTableData(eventApis, props.applicationId)}
          notFoundMessage={"There are no event APIs available"}
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
