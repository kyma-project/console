import React from 'react';
import PropTypes from 'prop-types';

import NamespaceDetailsCard from './NamespaceDetailsCard/NamespaceDetailsCard';
import './NamespacesGrid.scss';
import getPodsCounts from './getPodsCounts';
import { backendModuleExists } from 'commons/helpers';

NamespacesGrid.propTypes = {
  namespaces: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.any,
      stauts: PropTypes.any,
      applications: PropTypes.any,
      isSystemNamespace: PropTypes.any,
      pods: PropTypes.arrayOf(
        PropTypes.shape({ status: PropTypes.string.isRequired }),
      ).isRequired,
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
              name={name}
              allPodsCount={allPodsCount}
              healthyPodsCount={healthyPodsCount}
              status={status}
              isSystemNamespace={isSystemNamespace}
              applications={
                backendModuleExists('applications') ? applications : null
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
