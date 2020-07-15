import React from 'react';
import PropTypes from 'prop-types';

import { PageHeader, StatusBadge, EMPTY_TEXT_PLACEHOLDER } from 'react-shared';
import { Button } from 'fundamental-react';
import '../../../../shared/styles/header.scss';
import { useGetKubeconfig } from 'shared/hooks/useGetKubeconfig';
import { getBadgeTypeForStatus } from 'components/Shared/getBadgeTypeForStatus';

RuntimeDetailsHeader.propTypes = {
  runtime: PropTypes.object.isRequired,
};

export default function RuntimeDetailsHeader({ runtime }) {
  const downloadKubeconfig = useGetKubeconfig();

  const actions = (
    <Button glyph="download" onClick={() => downloadKubeconfig(runtime.id)}>
      Get Kubeconfig
    </Button>
  );

  const { name, description, id, status } = runtime;
  const breadcrumbItems = [{ name: 'Runtimes', path: '/' }, { name: '' }];

  return (
    <PageHeader
      breadcrumbItems={breadcrumbItems}
      title={name}
      actions={actions}
    >
      {status && (
        <PageHeader.Column title="Status" columnSpan={null}>
          {
            <StatusBadge type={getBadgeTypeForStatus(status)}>
              {status.condition}
            </StatusBadge>
          }
        </PageHeader.Column>
      )}
      <PageHeader.Column title="Description" columnSpan={null}>
        {description ? description : EMPTY_TEXT_PLACEHOLDER}
      </PageHeader.Column>
      <PageHeader.Column title="ID" columnSpan={null}>
        {id}
      </PageHeader.Column>
    </PageHeader>
  );
}
