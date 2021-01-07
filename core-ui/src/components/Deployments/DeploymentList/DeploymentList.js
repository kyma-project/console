import React from 'react';
import PropTypes from 'prop-types';

import jsyaml from 'js-yaml';
import { Link } from 'fundamental-react';

import { createPatch } from 'rfc6902';

import {
  GenericList,
  Labels,
  useYamlEditor,
  useNotification,
  useGet,
  useUpdate,
  useDelete,
  useSubscription,
  handlePamelaSubscriptionEvent,
} from 'react-shared';
import Moment from 'react-moment';

DeploymentList.propTypes = { namespace: PropTypes.string.isRequired };

export default function DeploymentList({ namespace }) {
  const deploymentUrl = `/apis/apps/v1/namespaces/${namespace}/deployments`;

  const [deployments, setDeployments] = React.useState([]);
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();
  const updateDeploymentMutation = useUpdate(deploymentUrl);
  const deleteDeploymentMutation = useDelete(deploymentUrl);
  const { loading = true, error } = useGet(
    deploymentUrl,
    setDeployments,
    namespace,
  );

  useSubscription(
    'deployments',
    React.useCallback(handlePamelaSubscriptionEvent(setDeployments), [
      namespace,
    ]),
    { namespace },
  );

  const handleSaveClick = deploymentData => async newYAML => {
    try {
      const diff = createPatch(deploymentData, jsyaml.safeLoad(newYAML));
      const url = deploymentUrl + '/' + deploymentData.metadata.name;
      await updateDeploymentMutation(url, {
        name: deploymentData.metadata.name,
        namespace,
        mergeJson: diff,
      });
      notification.notifySuccess({ title: 'Succesfully updated Deployment' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        title: 'Failed to update the Deployment',
        content: e.message,
      });
      throw e;
    }
  };

  async function handleDeploymentDelete(deployment) {
    const url = deploymentUrl + '/' + deployment.metadata.name;
    try {
      await deleteDeploymentMutation(url, {
        name: deployment.metadata.name,
        namespace,
      });
      notification.notifySuccess({ title: 'Succesfully deleted Deployment' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        title: 'Failed to delete the Deployment',
        content: e.message,
      });
      throw e;
    }
  }

  const actions = [
    {
      name: 'Edit',
      handler: deployment =>
        setEditedSpec(deployment.json, handleSaveClick(deployment.json)),
    },
    {
      name: 'Delete',
      handler: handleDeploymentDelete,
    },
  ];

  const headerRenderer = () => ['Name', 'Age', 'Labels'];

  const rowRenderer = entry => [
    <Link>{entry.metadata.name}</Link>,

    <Moment utc fromNow>
      {entry.metadata.creationTimestamp}
    </Moment>,
    <div style={{ maxWidth: '55em' /*TODO*/ }}>
      <Labels labels={entry.metadata.labels} />
    </div>,
  ];

  return (
    <GenericList
      textSearchProperties={['metadata.name']}
      actions={actions}
      entries={deployments || []}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={error}
      serverErrorMessage={error?.message}
      serverDataLoading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
