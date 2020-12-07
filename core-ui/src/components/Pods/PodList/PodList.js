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
  StatusBadge,
  useGet,
  useUpdate,
  useDelete,
  useSubscription,
  handlePamelaSubscriptionEvent,
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
    React.useCallback(handlePamelaSubscriptionEvent(setPods), [namespace]),
    { namespace },
  );

  const handleSaveClick = podData => async newYAML => {
    try {
      const diff = createPatch(podData, jsyaml.safeLoad(newYAML));
      await updatePodMutation({
        name: podData.metadata.name,
        namespace,
        mergeJson: diff,
      });
      notification.notifySuccess({ title: 'Succesfully updated Pod' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        title: 'Failed to update the Pod',
        content: e.message,
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
      notification.notifySuccess({ title: 'Succesfully deleted Pod' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        title: 'Failed to delete the Pod',
        content: e.message,
      });
      throw e;
    }
  }

  const actions = [
    {
      name: 'Edit',
      handler: pod => setEditedSpec(pod.json, handleSaveClick(pod.json)),
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
