import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { DELETE_NAMESPACE } from 'gql/mutations';

import { useLambdasQuery } from 'components/Lambdas/gql/hooks/queries';
import CreateLambdaModal from 'components/Lambdas/LambdasList/Lambdas/CreateLambdaModal';
import { LAMBDAS_LIST } from 'components/Lambdas/constants';

import { PageHeader, handleDelete, LogsLink, useConfig } from 'react-shared';
import { Button, Menu, Popover } from 'fundamental-react';
import NamespaceLabels from './NamespaceLabels/NamespaceLabels';
import DeployResourceModal from '../DeployResourceModal/DeployResourceModal';

import './NamespaceDetailsHeader.scss';

NamespaceDetailsHeader.propTypes = { namespace: PropTypes.object.isRequired };

export default function NamespaceDetailsHeader({ namespace }) {
  const [deleteNamespace] = useMutation(DELETE_NAMESPACE);

  const DOMAIN = useConfig().fromConfig('domain');
  const query = `{namespace="${namespace.name}"}`;

  const handleNamespaceDelete = () =>
    handleDelete(
      'namespace',
      null,
      namespace.name,
      () => deleteNamespace({ variables: { name: namespace.name } }),
      () => LuigiClient.linkManager().navigate('/'),
    );

  const { lambdas, repositories, error, loading, loadedData } = useLambdasQuery(
    {
      namespace: namespace.name,
    },
  );

  const functionNames = lambdas.map(l => l.name) || [];
  const serverDataError = error || false;
  const serverDataLoading = loading || !loadedData || false;
  const actions = (
    <>
      <LogsLink domain={DOMAIN} query={query} />

      <Popover
        body={
          <Menu>
            <Menu.List>
              <DeployResourceModal
                namespace={namespace.name}
                modalOpeningComponent={<Menu.Item>Upload YAML</Menu.Item>}
              />
              {!Boolean(serverDataError || serverDataLoading) && (
                <CreateLambdaModal
                  functionNames={functionNames}
                  repositories={repositories}
                  serverDataError={serverDataError}
                  serverDataLoading={serverDataLoading}
                  modalOpeningComponent={
                    <Menu.Item>
                      {' '}
                      {LAMBDAS_LIST.CREATE_MODAL.OPEN_BUTTON.TEXT}
                    </Menu.Item>
                  }
                />
              )}
            </Menu.List>
          </Menu>
        }
        control={
          <Button
            option="light"
            className="fd-has-margin-left-tiny"
            glyph="add"
          >
            Deploy new workload
          </Button>
        }
        widthSizingType="matchTarget"
        placement="bottom-end"
      />
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
