import React from 'react';
import { Query } from 'react-apollo';
import { Panel } from 'fundamental-react/lib/Panel';
import { GET_RUNTIMES } from '../gql';
import { Table } from '@kyma-project/react-components';

const prepareRowData = runtimesArray =>
  runtimesArray.map(runtime => ({
    rowData: [runtime.name, runtime.description],
  }));

const RuntimeList = () => (
  <Query query={GET_RUNTIMES}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <Panel className="fd-has-margin-top-medium">
          <Panel.Header>
            <Panel.Head title="Runtime list" />
          </Panel.Header>
          <Panel.Body>
            <Table
              headers={['Name', 'Description']}
              tableData={prepareRowData(data.runtimes.data)}
              notFoundMessage={'There are no runtimes available'}
            />
          </Panel.Body>
        </Panel>
      );
    }}
  </Query>
);

export default RuntimeList;
