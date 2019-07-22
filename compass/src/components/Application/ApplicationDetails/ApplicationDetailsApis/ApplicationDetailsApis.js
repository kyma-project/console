import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import LuigiClient from '@kyma-project/luigi-client';
import { withApollo } from 'react-apollo';
import { DELETE_APPLICATION_API, GET_APPLICATION } from './../../gql';
import _ from 'lodash';

ApplicationDetailsApis.propTypes = {
  apis: PropTypes.object.isRequired,
};

function ApplicationDetailsApis(props) {
  const listRef = React.useRef();
  const apisList = props.apis.data;

  function deleteHandler(entry) {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Remove API',
        body: `Are you sure you want to delete ${entry.name}?`,
        buttonConfirm: 'Yes',
        buttonDismiss: 'No',
      })
      .then(() => {
        const mutation = {
          mutation: DELETE_APPLICATION_API,
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
            console.log(application);
            const updatedApplication = _.cloneDeep(application);

            updatedApplication.apis.data = updatedApplication.apis.data.filter(
              api => api.id !== entry.id,
            );
            updatedApplication.apis.totalCount -= 1;

            console.log(updatedApplication);
            props.client.cache.writeQuery({
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

  const headerRenderer = () => ['Name', 'Description', 'Target URL'];

  const rowRenderer = api => [
    <span className="link">
      {/* todo add link to API (other task) */}
      {api.name}
    </span>,
    api.description,
    api.targetURL,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: deleteHandler,
    },
  ];

  return (
    <Panel className="fd-has-margin-top-small">
      <GenericList
        ref={listRef}
        title="APIs"
        description="List of APIs"
        actions={actions}
        entries={apisList}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}

export default withApollo(ApplicationDetailsApis);
