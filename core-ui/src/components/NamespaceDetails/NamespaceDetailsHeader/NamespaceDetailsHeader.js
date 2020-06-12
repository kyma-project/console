import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_NAMESPACE } from 'gql/mutations';

import { PageHeader, Labels, handleDelete } from 'react-shared';
import { Button } from 'fundamental-react';
import EditNamespaceLabelsModal from './EditNamespaceLabelsModal/EditNamespaceLabelsModal';
import DeployResourceModal from '../DeployResourceModal/DeployResourceModal';

NamespaceDetailsHeader.propTypes = { namespace: PropTypes.object.isRequired };

export default function NamespaceDetailsHeader({ namespace }) {
  const [deleteNamespace] = useMutation(DELETE_NAMESPACE);

  const handleNamespaceDelete = () =>
    handleDelete(
      'namespace',
      null,
      namespace.name,
      () => deleteNamespace({ variables: { name: namespace.name } }),
      () => LuigiClient.linkManager().navigate('/'),
    );

  const actions = (
    <>
      <DeployResourceModal name={namespace.name} />
      <Button
        option="light"
        type="negative"
        onClick={handleNamespaceDelete}
        className="fd-has-margin-left-tiny"
      >
        Delete
      </Button>
    </>
  );

  const breadcrumbs = [
    { name: 'Namespaces', path: '/', fromAbsolutePath: true },
    { name: '' },
  ];

  const labelsTitle = (
    <>
      <span>Labels</span>
      <EditNamespaceLabelsModal namespace={namespace} />
    </>
  );

  return (
    <PageHeader
      title={namespace.name}
      actions={actions}
      breadcrumbItems={breadcrumbs}
    >
      <PageHeader.Column title={labelsTitle}>
        <Labels labels={namespace.labels} />
      </PageHeader.Column>
    </PageHeader>
  );
}
