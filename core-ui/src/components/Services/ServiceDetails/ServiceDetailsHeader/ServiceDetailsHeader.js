import React from 'react';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { UPDATE_SERVICE } from 'gql/mutations';
import { GET_SERVICE } from 'gql/queries';

import { PageHeader, HeaderLabelsEditor, useNotification } from 'react-shared';
import ResourceSpecModal from 'shared/components/ResourceSpecModal/ResourceSpecModal';

ServiceDetailsHeader.propTypes = {
  namespaceId: PropTypes.string.isRequired,
  service: PropTypes.object.isRequired,
};

export default function ServiceDetailsHeader({ namespaceId, service }) {
  const [updateServiceMutation] = useMutation(UPDATE_SERVICE);
  const notification = useNotification();

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
      return false; // so that HeaderLabelsEditor modal doesn't close
    }
  };

  const breadcrumbItems = [
    { name: 'Services', path: '/', fromContext: 'services' },
    { name: '' },
  ];

  return (
    <PageHeader
      title={service.name}
      breadcrumbItems={breadcrumbItems}
      actions={
        <ResourceSpecModal
          name={service.name}
          spec={JSON.stringify(service.json)}
          updateResource={spec => updateService(JSON.parse(spec))}
        />
      }
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
