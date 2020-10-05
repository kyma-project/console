import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_NAMESPACE } from 'gql/mutations';

import { PageHeader, handleDelete, LogsLink, useConfig } from 'react-shared';
import { Button } from 'fundamental-react';
import NamespaceLabels from './NamespaceLabels/NamespaceLabels';
import DeployResourceModal from '../DeployResourceModal/DeployResourceModal';

NamespaceDetailsHeader.propTypes = { namespace: PropTypes.object.isRequired };

export default function NamespaceDetailsHeader({ namespace }) {
  const [deleteNamespace] = useMutation(DELETE_NAMESPACE);

  const DOMAIN = useConfig().fromConfig('domain');

  /* eslint-disable no-useless-escape */
  const query = `{namespace=\"${namespace.name}\"}`;
  /* eslint-enable no-useless-escape */

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
      <LogsLink domain={DOMAIN} query={query} />
      <DeployResourceModal namespace={namespace.name} />
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

  return (
    <PageHeader
      title={namespace.name}
      actions={actions}
      breadcrumbItems={breadcrumbs}
    >
      <NamespaceLabels namespace={namespace} />
    </PageHeader>
  );
}
