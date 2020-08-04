import React from 'react';
import PropTypes from 'prop-types';

import NamespaceDetailsCard from './NamespaceDetailsCard/NamespaceDetailsCard';
import './NamespacesGrid.scss';

NamespacesGrid.propTypes = {
  namespaces: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.any,
      status: PropTypes.any,
      applicationsCount: PropTypes.number,
      isSystemNamespace: PropTypes.any,
      podsCount: PropTypes.number,
      healthyPodsCount: PropTypes.number,
    }),
  ).isRequired,
};

export default function NamespacesGrid({ namespaces }) {
  return (
    <ul className="grid-wrapper fd-has-margin-medium">
      {namespaces.map(namespace => {
        const {
          name,
          podsCount,
          healthyPodsCount,
          status,
          applicationsCount,
          isSystemNamespace,
        } = namespace;

        return (
          <li key={name}>
            <NamespaceDetailsCard
              name={name}
              allPodsCount={podsCount}
              healthyPodsCount={healthyPodsCount}
              status={status}
              isSystemNamespace={isSystemNamespace}
              applicationsCount={applicationsCount}
            />
          </li>
        );
      })}
    </ul>
  );
}
