import React from 'react';
import PropTypes from 'prop-types';

import jsyaml from 'js-yaml';
import { Link } from 'fundamental-react';

import {
  GenericList,
  Labels,
  useYamlEditor,
  useNotification,
  StatusBadge,
  useGet,
  useUpdate,
  useDelete,
  useSubscription,
  handleSubscriptionEvent,
} from 'react-shared';
import Moment from 'react-moment';

PodList.propTypes = { namespace: PropTypes.string.isRequired };

const PodStatus = ({ pod }) => {
  const phase = pod.status?.phase; //TODO consider statusConditions to calculate status
  return <StatusBadge autoResolveType>{phase}</StatusBadge>;
};

export default function PodList({ namespace }) {
  const [pods, setPods] = React.useState([]);
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();
  const updatePodMutation = useUpdate('pods');
  const deletePodMutation = useDelete('pods');
  const { loading = true, error } = useGet('pods', setPods, namespace);

  useSubscription(
    'pods',
    React.useCallback(handleSubscriptionEvent(setPods), [namespace]),
    { namespace },
  );

  const handleSaveClick = podData => async newYAML => {
    try {
      await updatePodMutation({
        name: podData.metadata.name,
        namespace,
        json: jsyaml.safeLoad(newYAML),
      });
      notification.notifySuccess({ content: 'Succesfully updated Pod' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        content: 'Failed to update the Pod',
      });
      throw e;
    }
  };

  async function handlePodDelete(pod) {
    try {
      await deletePodMutation({
        name: pod.metadata.name,
        namespace,
      });
      notification.notifySuccess({ content: 'Succesfully deleted Pod' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        content: 'Failed to delete the Pod',
      });
      throw e;
    }
  }

  const actions = [
    {
      name: 'Edit',
      handler: pod => setEditedSpec(pod.json, handleSaveClick(pod)),
    },
    {
      name: 'Delete',
      handler: handlePodDelete,
    },
  ];

  const headerRenderer = () => ['Name', 'Age', 'Labels', 'Status'];

  const rowRenderer = entry => [
    <Link>{entry.metadata.name}</Link>,

    <Moment utc fromNow>
      {entry.metadata.creationTimestamp}
    </Moment>,
    <div style={{ maxWidth: '55em' /*TODO*/ }}>
      <Labels labels={entry.metadata.labels} />
    </div>,
    <PodStatus pod={entry} />,
  ];

  return (
    <GenericList
      textSearchProperties={['metadata.name']}
      actions={actions}
      entries={pods || []}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={error}
      serverErrorMessage={error?.message}
      serverDataLoading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
