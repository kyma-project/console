import React from 'react';

import { Query } from 'react-apollo';
import { Panel } from 'fundamental-react/lib/Panel';
import { GET_RUNTIMES } from '../gql';
import { Table } from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';
import CreateApplicationModal from '../../Applications/CreateApplicationModal/CreateApplicationModal.container';

const prepareRowData = runtimesArray =>
  runtimesArray.map(runtime => ({
    rowData: [
      <span
        className="link "
        onClick={() =>
          LuigiClient.linkManager()
            .fromClosestContext()
            .navigate(`/runtime/${runtime.id}`)
        }
      >
        {runtime.name}
      </span>,
      runtime.description,
    ],
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
            {/* TODO: Move to ApplicationsList  when it is ready */}
            <Panel.Actions>
              <CreateApplicationModal />
            </Panel.Actions>
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
