import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { withApollo } from 'react-apollo';
import _ from 'lodash';

import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import AddAPIModal from './../AddAPIModal/AddAPIModal';

import { DELETE_APPLICATION_EVENT_API, GET_APPLICATION } from './../../gql';

ApplicationDetailsEventApis.propTypes = {
  eventApis: PropTypes.object.isRequired,
};

function ApplicationDetailsEventApis(props) {
  const eventApiList = props.eventApis.data;

  function deleteHandler(entry) {
    function updateCache() {
      const originalQuery = {
        query: GET_APPLICATION,
        variables: { id: props.applicationId },
      };
      const { application } = props.client.cache.readQuery(originalQuery);
      // needed for actually refreshing Query components
      const updatedApplication = _.cloneDeep(application);

      updatedApplication.eventAPIs.data = updatedApplication.eventAPIs.data.filter(
        eventApi => eventApi.id !== entry.id,
      );
      updatedApplication.eventAPIs.totalCount -= 1;

      props.client.writeQuery({
        ...originalQuery,
        data: { application: updatedApplication },
      });
    }

    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Remove Event API',
        body: `Are you sure you want to delete ${entry.name}?`,
        buttonConfirm: 'Yes',
        buttonDismiss: 'No',
      })
      .then(() => {
        const mutation = {
          mutation: DELETE_APPLICATION_EVENT_API,
          variables: { id: entry.id },
        };

        return props.client
          .mutate(mutation)
          .then(updateCache)
          .catch(err => console.warn(err)); // todo ładniej
      })
      .catch(() => {});
  }

  const headerRenderer = () => ['Name', 'Description'];

  const rowRenderer = api => [
    <span className="link">
      {/* todo add link to API (other task) */}
      {api.name}
    </span>,
    api.description,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: deleteHandler,
    },
  ];
  return (
    <Panel className="fd-has-margin-top-medium">
      <GenericList
        extraHeaderContent={<AddAPIModal applicationId={props.applicationId} />}
        title="Event APIs"
        description="List of Event APIs"
        actions={actions}
        entries={eventApiList}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}

export default withApollo(ApplicationDetailsEventApis);
//todo hardkodowany tekst
//todo mizerne odświeanie listy
//todo TESTUJ
//todo popover nie znika
