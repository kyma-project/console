import React from 'react';
import PropTypes from 'prop-types';

import NamespaceDetailsCard from './NamespaceDetailsCard/NamespaceDetailsCard';
import './NamespacesGrid.scss';
import getPodsCounts from './getPodsCounts';

NamespacesGrid.propTypes = {
  namespaces: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.any,
      stauts: PropTypes.any,
      pods: PropTypes.arrayOf(
        PropTypes.shape({ status: PropTypes.string.isRequired }),
      ).isRequired,
      applications: PropTypes.array,
      isSystemNamespace: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default function NamespacesGrid({ namespaces }) {
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
              applicationsCount={
                applications !== null ? applications.length : null
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
