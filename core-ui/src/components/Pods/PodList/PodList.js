import React from 'react';
import PropTypes from 'prop-types';

import jsyaml from 'js-yaml';
import { Link } from 'fundamental-react';

import {
  GenericList,
  Labels,
  useYamlEditor,
  useNotification,
  EMPTY_TEXT_PLACEHOLDER,
  useGet,
  useUpdate,
  useDelete,
  useSubscription,
} from 'react-shared';

PodList.propTypes = { namespace: PropTypes.string.isRequired };

export function handleSubscriptionEvent(setResource) {
  const filterByName = obj => entry =>
    entry.metadata.name !== obj.metadata.name;

  return data => {
    const { type, object } = data;
    console.log('GOT EVENT', type, object);
    switch (type) {
      case 'ADDED':
        setResource(resource => {
          if (!resource.find(r => r.metadata.name === object.metadata.name)) {
            return [...resource, object];
          }
          return resource;
        });
        break;
      case 'DELETED':
        setResource(resource => resource.filter(filterByName(object)));
        break;
      case 'MODIFIED':
        setResource(
          resource => resource.map(r => (filterByName(object)(r) ? r : object)), // fancy
        );
        break;
      default:
        console.log(data);
        break;
    }
  };
}

export default function PodList({ namespace }) {
  const [pods, setPods] = React.useState([]);
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();
  const updatePodMutation = useUpdate('pods');
  const deletePodMutation = useDelete('pods');
  const { loading = true, error } = useGet('pods', setPods, namespace);

  useSubscription(
    'pods',
    React.useCallback(handleSubscriptionEvent(setPods), []),
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

  const headerRenderer = () => [
    'Name',
    'Cluster IP',
    'Internal endpoints',
    'Age',
    'Labels',
  ];

  const rowRenderer = entry => [
    <Link>{entry.metadata.name}</Link>,
    <>
      {Object.keys(entry.metadata.labels).map(k => (
        <div>{k}</div>
      ))}
    </>,
  ];

  return (
    <GenericList
      actions={actions}
      entries={pods || []}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={error}
      serverDataLoading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
