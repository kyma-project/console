import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';
import jsyaml from 'js-yaml';

import { useMutation } from '@apollo/react-hooks';
import { UPDATE_SERVICE, DELETE_SERVICE } from 'gql/mutations';
import { GET_SERVICE } from 'gql/queries';

import {
  PageHeader,
  HeaderLabelsEditor,
  useNotification,
  useYamlEditor,
  easyHandleDelete,
} from 'react-shared';
import { Button } from 'fundamental-react';

ServiceDetailsHeader.propTypes = {
  namespaceId: PropTypes.string.isRequired,
  service: PropTypes.object.isRequired,
};

export default function ServiceDetailsHeader({ namespaceId, service }) {
  const [updateServiceMutation] = useMutation(UPDATE_SERVICE);
  const [deleteServiceMutation] = useMutation(DELETE_SERVICE);
  const notification = useNotification();
  const setEditedSpec = useYamlEditor();

  const updateServiceLabels = labels => {
    const updatedSpec = {
      ...service.json,
      metadata: {
        ...service.json.metadata,
        labels,
      },
    };
    updateService(updatedSpec);
  };

  const updateService = async updatedSpec => {
    try {
      await updateServiceMutation({
        variables: {
          namespace: namespaceId,
          name: service.name,
          service: updatedSpec,
        },
        refetchQueries: () => [
          {
            query: GET_SERVICE,
            variables: {
              namespace: namespaceId,
              name: service.name,
            },
          },
        ],
      });
      notification.notifySuccess({
        content: 'Service updated successfully',
      });
    } catch (e) {
      console.warn(e);
      notification.notifyError({
        content: `Cannot update service: ${e.message}.`,
      });
      throw e;
    }
  };

  const deleteService = () => {
    easyHandleDelete(
      'Service',
      service.name,
      deleteServiceMutation,
      { variables: { name: service.name, namespace: namespaceId } },
      'deleteService',
      notification,
      () =>
        LuigiClient.linkManager()
          .fromClosestContext()
          .navigate('/'),
    );
  };

  const actions = (
    <>
      <Button
        option="emphasized"
        onClick={() =>
          setEditedSpec(
            service.json,
            async spec => await updateService(jsyaml.safeLoad(spec)),
          )
        }
      >
        Edit
      </Button>
      <Button option="light" type="negative" onClick={deleteService}>
        Delete
      </Button>
    </>
  );

  const breadcrumbItems = [
    { name: 'Services', path: '/', fromContext: 'services' },
    { name: '' },
  ];

  return (
    <PageHeader
      title={service.name}
      breadcrumbItems={breadcrumbItems}
      actions={actions}
    >
      <HeaderLabelsEditor
        labels={service.labels || {}}
        onApply={updateServiceLabels}
        columnSpan="1 / 3"
      />
      <PageHeader.Column title="Cluster IP" columnSpan="3 / 4">
        {service.clusterIP}
      </PageHeader.Column>
    </PageHeader>
  );
}
