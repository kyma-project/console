import React from 'react';
import PropTypes from 'prop-types';

import NamespaceDetailsCard from './NamespaceDetailsCard/NamespaceDetailsCard';
import './NamespacesGrid.scss';

NamespacesGrid.propTypes = {
  namespaces: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default function NamespacesGrid({ namespaces }) {
  // todo replace with custom backend data
  const getPodsCounts = pods => {
    const allPodsCount = pods.length;
    const healthyPodsCount = pods.filter(
      pod => pod.status === 'RUNNING' || pod.status === 'TERMINATING',
    ).length;

    return [allPodsCount, healthyPodsCount];
  };

  return (
    <ul className="grid-wrapper fd-has-margin-medium">
      {namespaces.map(namespace => {
        const {
          name,
          pods,
          status,
          applications,
          isSystemNamespace,
        } = namespace;
        const [allPodsCount, healthyPodsCount] = getPodsCounts(pods);

        return (
          <li key={name}>
            <NamespaceDetailsCard
              namespaceName={name}
              allPodsCount={allPodsCount}
              healthyPodsCount={healthyPodsCount}
              status={status}
              isSystemNamespace={isSystemNamespace}
              applicationsCount={applications.length}
            />
          </li>
        );
      })}
    </ul>
  );
}
