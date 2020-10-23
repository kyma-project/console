import React, { useRef } from 'react';
import { GenericList, useYamlEditor, useNotification } from 'react-shared';
import jsyaml from 'js-yaml';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_RESOURCE_QUOTA } from '../../../gql/mutations';
import { GET_NAMESPACE } from '../../../gql/queries';

const headerRenderer = _ => [
  'Name',
  'Pods',
  'Limits memory',
  'Requests memory',
];

const rowRenderer = resourceQuota => {
  const quota = resourceQuota.spec.hard;

  return [
    resourceQuota.name,
    quota.pods || '-',
    quota.limits?.memory || '-',
    quota.requests?.memory || '-',
  ];
};

const ResourceQuotas = ({ resourceQuotas, namespaceName: namespace }) => {
  const setEditedJson = useYamlEditor();
  const notificationManager = useNotification();
  const editedResourceQuota = useRef(null);

  const [updateResourceQuota] = useMutation(UPDATE_RESOURCE_QUOTA, {
    onCompleted: ({ updateResourceQuota }) =>
      notificationManager.notifySuccess({
        content: 'Succesfully updated ' + updateResourceQuota.name,
      }),
    refetchQueries: [{ query: GET_NAMESPACE, variables: { name: namespace } }],
  });

  async function handleSaveClick(newYAML) {
    let json;

    try {
      json = jsyaml.safeLoad(newYAML);
      if (json.metadata?.resourceVersion) delete json.metadata.resourceVersion; // TODO: do this on the backend side
      await updateResourceQuota({
        variables: {
          name: editedResourceQuota.current?.name,
          json,
          namespace,
        },
      });
    } catch (e) {
      notificationManager.notifyError({
        content: 'Failed to update the ResourceQuota',
      });
      throw e;
    }
  }

  const actions = [
    {
      name: 'Edit',
      handler: resourceQuota => {
        editedResourceQuota.current = resourceQuota;
        setEditedJson(resourceQuota.json, handleSaveClick);
      },
    },
  ];

  return (
    <GenericList
      hasExternalMargin={false}
      title="Resource quotas"
      notFoundMessage="No resource quotas"
      entries={resourceQuotas}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      actions={actions}
      className="namespace-quotas"
    />
  );
};
export default ResourceQuotas;
