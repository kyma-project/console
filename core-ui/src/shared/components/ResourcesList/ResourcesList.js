import React from 'react';
import PropTypes from 'prop-types';
import jsyaml from 'js-yaml';
import { Link } from 'fundamental-react';
import { createPatch } from 'rfc6902';
import Moment from 'react-moment';

import {
  PageHeader,
  YamlEditorProvider,
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

ResourcesList.propTypes = {
  resource: PropTypes.object,
  namespace: PropTypes.string.isRequired,
};

export default function ResourcesList({ resource, namespace }) {
  if (!resource) {
    return <></>; // wait for the context update
  }

  const resourceObject = resource;
  if (!resource.kindPlural) {
    const kind = resource.kind?.toLowerCase();
    resourceObject.kindPlural = resource.kind?.endsWith('s', 'x', 'ch', 'sh')
      ? `${kind}es`
      : `${kind}s`;
  }

  const capitalizeFirstLetter = string => {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  };

  return (
    <YamlEditorProvider>
      <PageHeader title={capitalizeFirstLetter(resourceObject.kindPlural)} />
      <Resources resourceObject={resourceObject} namespace={namespace} />
    </YamlEditorProvider>
  );
}

function Resources({ resourceObject, namespace }) {
  const { apiVersion, kindPlural } = resourceObject;
  const api = apiVersion === 'v1' ? 'api' : 'apis';
  const resourceUrl = `/${api}/${apiVersion}${
    namespace ? `/namespaces/${namespace}` : ''
  }/${kindPlural}`;

  const [resources, setResources] = React.useState([]);
  const setEditedSpec = useYamlEditor();
  const notification = useNotification();
  const updateResourceMutation = useUpdate(resourceUrl);
  const deleteResourceMutation = useDelete(resourceUrl);
  const { loading = true, error } = useGet(
    resourceUrl,
    setResources,
    namespace,
  );

  useSubscription(
    kindPlural,
    React.useCallback(handlePamelaSubscriptionEvent(setResources), [namespace]),
    { namespace },
  );

  const handleSaveClick = resourceData => async newYAML => {
    try {
      const diff = createPatch(resourceData, jsyaml.safeLoad(newYAML));
      const url = resourceUrl + '/' + resourceData.metadata.name;
      await updateResourceMutation(url, {
        name: resourceData.metadata.name,
        namespace,
        mergeJson: diff,
      });
      notification.notifySuccess({ title: 'Succesfully updated Resource' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        title: 'Failed to update the Resource',
        content: e.message,
      });
      throw e;
    }
  };

  async function handleResourceDelete(resource) {
    const url = resourceUrl + '/' + resource.metadata.name;
    try {
      await deleteResourceMutation(url, {
        name: resource.metadata.name,
        namespace,
      });
      notification.notifySuccess({ title: 'Succesfully deleted Resource' });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        title: 'Failed to delete the Resource',
        content: e.message,
      });
      throw e;
    }
  }

  const actions = [
    {
      name: 'Edit',
      handler: resource =>
        setEditedSpec(resource.json, handleSaveClick(resource.json)),
    },
    {
      name: 'Delete',
      handler: handleResourceDelete,
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
      entries={resources || []}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={error}
      serverErrorMessage={error?.message}
      serverDataLoading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
