import React from 'react';
import { GenericList } from 'react-shared';
import { Icon } from 'fundamental-react';

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
    quota.pods,
    quota.limits.memory,
    quota.requests.memory,
  ];
};

const ResourceQuotas = ({ resourceQuotas }) => {
  const actions = [{ name: <Icon glyph="edit" />, handler: name => {} }];

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
