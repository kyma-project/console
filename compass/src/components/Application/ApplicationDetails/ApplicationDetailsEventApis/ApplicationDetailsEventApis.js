import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import LuigiClient from '@kyma-project/luigi-client';
import { withApollo } from 'react-apollo';
import { DELETE_APPLICATION_EVENT_API, GET_APPLICATION } from './../../gql';
import _ from 'lodash';

ApplicationDetailsEventApis.propTypes = {
  eventApis: PropTypes.object.isRequired,
};

function ApplicationDetailsEventApis(props) {
  const listRef = React.useRef();
  const eventApiList = props.eventApis.data;

  function deleteHandler(entry) {
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
          .then(() => {
            const originalQuery = {
              query: GET_APPLICATION,
              variables: { id: props.applicationId },
            };
            const { application } = props.client.cache.readQuery(originalQuery);
            const updatedApplication = _.cloneDeep(application);

            updatedApplication.eventAPIs.data = updatedApplication.eventAPIs.data.filter(
              eventApi => eventApi.id !== entry.id,
            );
            updatedApplication.eventAPIs.totalCount -= 1;

            props.client.writeQuery({
              ...originalQuery,
              data: { application: updatedApplication },
            });

            listRef.current.resetList();
          })
          .catch(err => {
            console.warn(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
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
        ref={listRef}
        title={'Event APIs ' + eventApiList.length}
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
