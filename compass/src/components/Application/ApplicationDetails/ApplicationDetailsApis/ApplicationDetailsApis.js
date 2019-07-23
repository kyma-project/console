import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { withApollo } from 'react-apollo';
import _ from 'lodash';

import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import AddAPIModal from './../AddAPIModal/AddAPIModal';

import { DELETE_APPLICATION_API, GET_APPLICATION } from './../../gql';

ApplicationDetailsApis.propTypes = {
  apis: PropTypes.object.isRequired,
};

function ApplicationDetailsApis(props) {
  const apisList = props.apis.data;

  function deleteHandler(entry) {
    function updateCache() {
      const originalQuery = {
        query: GET_APPLICATION,
        variables: { id: props.applicationId },
      };
      const { application } = props.client.cache.readQuery(originalQuery);
      const updatedApplication = _.cloneDeep(application);

      updatedApplication.apis.data = updatedApplication.apis.data.filter(
        api => api.id !== entry.id,
      );
      updatedApplication.apis.totalCount -= 1;

      props.client.writeQuery({
        ...originalQuery,
        data: { application: updatedApplication },
      });
    }

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
          .then(updateCache)
          .catch(err => console.warn(err)); // todo ładniej
      })
      .catch(() => {});
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
        extraHeaderContent={<AddAPIModal applicationId={props.applicationId} />}
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
