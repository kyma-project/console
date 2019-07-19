import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Table } from '@kyma-project/react-components';
import { Pagination } from 'fundamental-react/lib/Pagination';

function createTableData(eventApis) {
  return eventApis.map(eventApi => ({
    rowData: [eventApi.name, eventApi.description],
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
          headers={['Name', 'Description']}
          tableData={createTableData(eventApis)}
          notFoundMessage={'There are no event APIs available'}
        />
        {!!totalCount && (
          <Pagination
            displayTotal={false}
            itemsTotal={totalCount || 0}
            itemsPerPage={8}
            onClick={() => console.log('will be done in #1039')}
            className="fd-has-padding-top-small"
          />
        )}
      </Panel.Body>
    </Panel>
  );
};
