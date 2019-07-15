import React from 'react';
import { Panel, Table } from '@kyma-project/react-components';
import { Pagination } from 'fundamental-react/lib/Pagination';

function createTableData(apis) {
  return apis.map(api => ({
    rowData: [api.name, api.description, api.targetURL],
  }));
}

export default function ApplicationDetailsApis(props) {
  const { totalCount, data: apis } = props.apis;

  return (
    <Panel className="fd-has-margin-top-small">
      <Panel.Body>
        <Panel.Header>
          <Panel.Head title="APIs" />
        </Panel.Header>
        <Table
          headers={['Name', 'Description', 'Target URL']}
          tableData={createTableData(apis)}
          notFoundMessage={'There are no APIs available'}
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
